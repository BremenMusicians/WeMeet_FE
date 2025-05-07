import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useConcertSocket } from './useCurrentSocket';
import React from 'react';

interface PeerConnections {
  [accountId: string]: RTCPeerConnection;
}

interface AudioRefs {
  [accountId: string]: React.RefObject<HTMLAudioElement>;
}

export const useAudioConnectionNN = (
  isReady: boolean,
  audioRefs: AudioRefs,
  localAudioRef: React.RefObject<HTMLAudioElement>,
  myAccountId: string
) => {
  const searchParams = new URLSearchParams(useLocation().search);
  const roomId = searchParams.get('id');

  const { ws: socket } = useConcertSocket(roomId!);
  const audioStream = useRef<MediaStream | null>(null);
  const peerConnections = useRef<PeerConnections>({});

  const getLocalAudioStream = async () => {
    try {
      audioStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('🎙️ 로컬 마이크 스트림 얻음:', audioStream.current);

      if (localAudioRef.current) {
        localAudioRef.current.srcObject = audioStream.current;
        await localAudioRef.current.play();
        console.log('🎧 로컬 오디오 재생 중');
      }
    } catch (error) {
      console.error('🚫 마이크 접근 실패:', error);
    }
  };

  const setupPeerConnection = (accountId: string) => {
    console.log(`🔧 ${accountId}에 대한 PeerConnection 설정 중`);

    const pc = new RTCPeerConnection();

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.send(JSON.stringify({
          type: 'candidate',
          from: myAccountId,
          to: accountId,
          payload: event.candidate,
        }));
        console.log(`📤 ${accountId}에게 ICE 후보 전송`);
      }
    };

    pc.ontrack = (event) => {
      console.log(`🔊 ${accountId}의 트랙 수신`, event.streams);

      const remoteStream = event.streams[0];
      const ref = audioRefs[accountId];

      if (ref?.current) {
        ref.current.srcObject = remoteStream;
        ref.current.play().then(() => {
          console.log(`✅ ${accountId}의 오디오 재생 중`);
        }).catch(console.error);
      } else {
        console.warn(`❌ ${accountId}의 오디오 요소 없음`);
      }
    };

    if (audioStream.current) {
      audioStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, audioStream.current!);
        console.log(`📤 ${accountId}에게 트랙 전송`, track);
      });
    }

    peerConnections.current[accountId] = pc;
  };

  const handleMessage = async (message: MessageEvent) => {
    const { type, payload } = JSON.parse(message.data);
    const JSONpayload = JSON.parse(payload);

    console.log(`📩 메시지 수신: ${type} from: ${JSONpayload.accountId}`);  // 디버그 로그 추가
  
    switch (type) {
      case 'join': {
        if (!audioStream.current) await getLocalAudioStream();
        setupPeerConnection(JSONpayload.accountId);
        const offer = await peerConnections.current[JSONpayload.accountId].createOffer();
        await peerConnections.current[JSONpayload.accountId].setLocalDescription(offer);
        socket.current?.send(JSON.stringify({ type: 'offer', to: JSONpayload.accountId, payload: offer }));
        console.log(`📤 ${JSONpayload.accountId}에게 Offer 전송`);
        break;
      }
      case 'offer': {
        if (!audioStream.current) await getLocalAudioStream();
        setupPeerConnection(JSONpayload.accountId);
        await peerConnections.current[JSONpayload.accountId].setRemoteDescription(new RTCSessionDescription(payload));
        const answer = await peerConnections.current[JSONpayload.accountId].createAnswer();
        await peerConnections.current[JSONpayload.accountId].setLocalDescription(answer);
        socket.current?.send(JSON.stringify({ type: 'answer', to: JSONpayload.accountId, payload: answer }));
        console.log(`📤 ${JSONpayload.accountId}에게 Answer 전송`);
        break;
      }
      case 'answer':
        await peerConnections.current[JSONpayload.accountId].setRemoteDescription(new RTCSessionDescription(payload));
        console.log(`✅ ${JSONpayload.accountId}의 Answer 설정 완료`);
        break;
      case 'candidate':
        await peerConnections.current[JSONpayload.accountId].addIceCandidate(new RTCIceCandidate(payload));
        console.log(`✅ ${JSONpayload.accountId}의 ICE 후보 추가`);
        break;
      default:
        console.warn('❓ 알 수 없는 메시지 타입:', type);
    }
  };

  useEffect(() => {
    if (!isReady || !socket.current) return;
    if (!audioStream.current) getLocalAudioStream();

    const s = socket.current;
    s.onmessage = handleMessage;
    s.onopen = () => console.log('🔌 WebSocket 연결됨');
    s.onclose = () => console.log('🔌 WebSocket 연결 종료');
    s.onerror = (e) => console.error('WebSocket 에러:', e);

    return () => {
      s.onmessage = null;
      Object.values(peerConnections.current).forEach((pc) => pc.close());
      console.log('❎ PeerConnections 정리 완료');
      if (audioStream.current) {
        audioStream.current.getTracks().forEach((t) => t.stop());
      }
    };
  }, [isReady, socket]);

  useEffect(() => {
    if (isReady && socket.current?.readyState === WebSocket.OPEN) {
      socket.current.send(JSON.stringify({
        type: 'ready',
        from: myAccountId,
      }));
      console.log('📡 ready 메시지 전송');
    }
  }, [isReady, socket]);
};
