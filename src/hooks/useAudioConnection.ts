import { useCallback, useEffect, useRef } from 'react';
import { useConcertSocket } from './useCurrentSocket';

interface PeerConnections {
  [mail: string]: RTCPeerConnection;
}

/**
 * 오디오 연결을 위한 커스텀 훅
 * @param {boolean} isReady - 소켓 준비 상태
 * @param {Object} audioRefs - 오디오 엘리먼트 참조 객체
 * @param {string} myAccountId - 내 계정 ID
 * @param {React.RefObject<MediaStream | null>} audioStream - 오디오 스트림 참조
 * @param {function} getLocalAudioStream - 로컬 오디오 스트림을 가져오는 함수
 * @returns {{ socket: React.RefObject<WebSocket | null> }} - 소켓 객체
 * @throws {Error} 소켓 연결 실패 시 에러를 발생시킵니다.
 * @description 이 훅은 WebRTC를 사용하여 오디오 연결을 설정하고 관리합니다.
 * 소켓을 통해 다른 사용자와 오디오 스트림을 주고받습니다.
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
  const candidateQueue = useRef<{ [mail: string]: RTCIceCandidate[] }>({});

  const setupPeerConnection = async (mail: string) => {
    console.log(`🔗 PeerConnection 생성 시작 (${mail})`);

    if (!audioStream.current) {
      console.warn('🔇 audioStream 없음. 스트림을 먼저 가져옵니다.');
      audioStream.current = await getLocalAudioStream();
      console.log('🎤 로컬 오디오 스트림 가져옴 (setupPeerConnection)', audioStream.current);
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate && socket.current?.readyState === WebSocket.OPEN) {
        console.log(`📨 ICE 후보 전송 to ${mail}`, event.candidate);
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
      console.log('📥 상대방 오디오 수신됨:', remoteStream);
      const ref = audioRefs[mail];
      if (ref?.current) {
        ref.current.srcObject = remoteStream;
        ref.current.play().catch(console.error);
      }
    };

    if (audioStream.current) {
      audioStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, audioStream.current!);
        console.log(`🎙️ 오디오 트랙 추가됨:`, track);
      });
    }

    peerConnections.current[mail] = pc;

    const queue = candidateQueue.current[mail];
    if (queue) {
      queue.forEach((candidate) => {
        console.log(`🚀 큐에서 ICE 후보 적용 (${mail})`, candidate);
        pc.addIceCandidate(candidate);
      });
      delete candidateQueue.current[mail];
    }
  };

  const handleMessage = useCallback(async (message: MessageEvent) => {
    const { type, data, from, to } = JSON.parse(message.data);
    const mail = from;

    console.log(`📩 수신된 메시지: type=${type}, from=${from}, to=${to}`);

    try {
      switch (type) {
        case 'join': {
          console.log(`👋 참가자 입장 (${mail})`);
          if (!audioStream.current) audioStream.current = await getLocalAudioStream();
          await setupPeerConnection(mail);

          const offer = await peerConnections.current[mail].createOffer();
          await peerConnections.current[mail].setLocalDescription(offer);
          socket.current?.send(JSON.stringify({ type: 'offer', to: mail, data: offer }));
          break;
        }

        case 'offer': {
          console.log(`📩 Offer 수신 (${mail})`, data);
          if (!audioStream.current) audioStream.current = await getLocalAudioStream();
          if (!peerConnections.current[mail]) {
            await setupPeerConnection(mail);
          }
          await peerConnections.current[mail].setRemoteDescription(new RTCSessionDescription(data));
          const answer = await peerConnections.current[mail].createAnswer();
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
          const candidate = new RTCIceCandidate(data);
          const pc = peerConnections.current[mail];

          if (pc) {
            console.log(`✅ ICE 후보 즉시 적용 (${mail})`, candidate);
            await pc.addIceCandidate(candidate);
          } else {
            console.warn(`⏳ ${mail}에 대한 peerConnection 없음 → 후보 큐잉`);
            if (!candidateQueue.current[mail]) {
              candidateQueue.current[mail] = [];
            }
            candidateQueue.current[mail].push(candidate);
          }
          break;
        }

        default:
          console.warn('❓ 알 수 없는 메시지 타입:', type);
      }
    } catch (err) {
      console.error(`🚨 handleMessage 오류 (${type})`, err);
    }
  }, [myAccountId, audioRefs, audioStream, getLocalAudioStream]);

  const socket = useConcertSocket(roomId!, handleMessage).ws;

  useEffect(() => {
    if (!isReady || !socket.current) return;

    if (!audioStream.current) {
      getLocalAudioStream().then((stream) => {
        audioStream.current = stream;
        console.log('🎤 로컬 오디오 스트림 가져옴 (useEffect)', stream);

        const myAudio = audioRefs[myAccountId];
        if (myAudio?.current && stream) {
          myAudio.current.srcObject = stream;
          myAudio.current.muted = true;
          myAudio.current.play().catch(console.error);
        }
      });
    }

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
      console.log(`🚀 소켓 준비 완료. ready 메시지 전송 (${myAccountId})`);
      socket.current.send(JSON.stringify({ type: 'ready', from: myAccountId }));
    }
  }, [isReady, socket]);

  return { socket };
};
