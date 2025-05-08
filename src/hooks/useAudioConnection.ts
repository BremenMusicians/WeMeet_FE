import { useCallback, useEffect, useRef } from 'react';
import { useConcertSocket } from './useCurrentSocket';

interface PeerConnections {
  [mail: string]: RTCPeerConnection;
}

/**소켓 연결 및 오디오 스트림 관리 훅
이 훅은 WebRTC를 사용하여 오디오 스트림을 관리하고, 소켓을 통해 메시지를 주고받습니다.
- isReady: 소켓 연결 준비 상태
- audioRefs: 각 참가자의 오디오 스트림을 재생할 HTMLAudioElement의 Ref 객체
- myAccountId: 현재 사용자의 계정 ID 
- audioStream: 외부에서 주입받은 MediaStream 객체
- getLocalAudioStream: 로컬 오디오 스트림을 가져오는 함수
- socket: WebSocket 객체
- setupPeerConnection: PeerConnection을 설정하는 함수
- handleMessage: 수신된 메시지를 처리하는 함수
- useEffect: 소켓 연결 및 종료를 관리하는 useEffect 훅
- useEffect: 준비 완료 시 메시지를 전송하는 useEffect 훅
- useEffect: 컴포넌트 언마운트 시 PeerConnection 및 오디오 트랙을 종료하는 useEffect 훅
- useEffect: 소켓 연결 시 PeerConnection을 설정하는 useEffect 훅
- useEffect: 소켓 연결 종료 시 PeerConnection 및 오디오 트랙을 종료하는 useEffect 훅
- useEffect: 소켓 연결 시 메시지를 전송하는 useEffect 훅
*/

export const useAudioConnectionNN = (
  isReady: boolean,
  audioRefs: { [mail: string]: React.RefObject<HTMLAudioElement> },
  myAccountId: string,
  audioStream: React.RefObject<MediaStream | null>, 
  getLocalAudioStream: () => Promise<MediaStream | null>, 
) => {
  const roomId = new URLSearchParams(window.location.search).get('id');
  const peerConnections = useRef<PeerConnections>({});
  

  /** PeerConnection 설정 */
  const setupPeerConnection = (mail: string) => {
    console.log(`🔗 PeerConnection 생성 시작 (${mail})`);
    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(JSON.stringify({
          type: 'candidate',
          from: myAccountId,
          to: mail,
          data: event.candidate,
        }));
      }
    };

    pc.ontrack = (event) => {
      const remoteStream = event.streams[0];
      const ref = audioRefs[mail];
      if (ref?.current) {
        ref.current.srcObject = remoteStream;
        ref.current.play().catch(console.error);
      }
    };

    // 외부에서 받은 스트림을 추가
    if (audioStream.current) {
      audioStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, audioStream.current!);
      });
    }

    peerConnections.current[mail] = pc;
  };

  /** 메시지 처리 */
  const handleMessage = useCallback(async (message: MessageEvent) => {
    const { type, data, from } = JSON.parse(message.data);
  
    let mail: string ;
  
    if (type === 'candidate') {
      mail = from;
    } else {
      try {
        const parsed = JSON.parse(data)
        mail = parsed.mail;
      } catch (err) {
        console.error('❌ mail 파싱 실패:', err, '원본 data:', data);
        return;
      }
    }
  
    console.log(`📩 수신된 메시지 (${type}) from ${mail}`);
  
    switch (type) {
      case 'join': {
        console.log(`👋 참가자 입장 (${mail})`);
        if (!audioStream.current) await getLocalAudioStream();
        setupPeerConnection(mail);
  
        const offer = await peerConnections.current[mail].createOffer();
        console.log(`📤 Offer 생성 (${mail})`, offer);
        await peerConnections.current[mail].setLocalDescription(offer);
        socket.current?.send(JSON.stringify({ type: 'offer', to: mail, data: offer }));
        break;
      }
  
      case 'offer': {
        console.log(`📩 Offer 수신 (${mail})`, data);
        if (!audioStream.current) await getLocalAudioStream();
        setupPeerConnection(mail);
        await peerConnections.current[mail].setRemoteDescription(new RTCSessionDescription(data));
  
        const answer = await peerConnections.current[mail].createAnswer();
        console.log(`📤 Answer 생성 (${mail})`, answer);
        await peerConnections.current[mail].setLocalDescription(answer);
        socket.current?.send(JSON.stringify({ type: 'answer', to: mail, data: answer }));
        break;
      }
  
      case 'answer': {
        console.log(`📩 Answer 수신 (${mail})`, data);
        await peerConnections.current[mail].setRemoteDescription(new RTCSessionDescription(data));
        break;
      }
  
      case 'candidate': {
        console.log(`📩 ICE 후보 수신 (${mail})`, data);
        if (data) {
          await peerConnections.current[mail].addIceCandidate(new RTCIceCandidate(data));
        }
        break;
      }
  
      default:
        console.warn('❓ 알 수 없는 메시지 타입:', type);
    }
  }, [myAccountId, audioRefs, audioStream, getLocalAudioStream]);
  
  const socket = useConcertSocket(roomId!, handleMessage).ws;

  /** 소켓 연결 및 종료 */
  useEffect(() => {
    if (!isReady || !socket.current) return;

    if (!audioStream.current) getLocalAudioStream();

    const s = socket.current;
    s.onopen = () => console.log('🔌 WebSocket 연결됨');
    s.onclose = () => console.log('❌ WebSocket 연결 종료됨');
    s.onerror = (e) => console.error('⚠️ WebSocket 에러:', e);

    return () => {
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      if (audioStream.current) {
        audioStream.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isReady, socket]);

  useEffect(() => {
    if (isReady && socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({ type: 'ready', from: myAccountId }));
    }
  }, [isReady, socket]);

  return { socket };
};
