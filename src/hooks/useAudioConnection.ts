import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useConcertSocket } from './useCurrentSocket';
import React from 'react';

interface PeerConnections {
  [mail: string]: RTCPeerConnection;
}

interface AudioRefs {
  [mail: string]: React.RefObject<HTMLAudioElement>;
}

export const useAudioConnectionNN = (
  isReady: boolean,
  audioRefs: AudioRefs,
  localAudioRef: React.RefObject<HTMLAudioElement>,
  myAccountId: string
) => {
  const searchParams = new URLSearchParams(useLocation().search);
  const roomId = searchParams.get('id');

  const { ws: socket } = useConcertSocket(roomId!, handleMessage);
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

  const setupPeerConnection = (mail: string) => {
    console.log(`🔧 ${mail}에 대한 PeerConnection 설정 중`);

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    });

    pc.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.send(JSON.stringify({
          type: 'candidate',
          from: myAccountId,
          to: mail,
          data: event.candidate, 
        }));
        console.log(`📤 ${mail}에게 ICE 후보 전송`);
      }
    };

    pc.ontrack = (event) => {
      console.log(`🔊 ${mail}의 트랙 수신`, event.streams);

      const remoteStream = event.streams[0];
      const ref = audioRefs[mail];

      if (ref?.current) {
        ref.current.srcObject = remoteStream;
        ref.current.play().then(() => {
          console.log(`✅ ${mail}의 오디오 재생 중`);
        }).catch(console.error);
      } else {
        console.warn(`❌ ${mail}의 오디오 요소 없음`);
      }
    };

    if (audioStream.current) {
      audioStream.current.getTracks().forEach((track) => {
        pc.addTrack(track, audioStream.current!);
        console.log(`📤 ${mail}에게 트랙 전송`, track);
      });
    }

    peerConnections.current[mail] = pc;
  };

  async function handleMessage(message: MessageEvent) {
    const { type, payload, data } = JSON.parse(message.data);

    const JSONpayload = JSON.parse(payload);
    const {mail} = JSONpayload

    console.log(message.data)

    console.log(`📩 메시지 수신: ${type} from: ${mail}`);

    switch (type) {
      case 'join': {
        if (!audioStream.current) await getLocalAudioStream();
        console.log(`👤 ${mail}이 방에 참여함`);
        setupPeerConnection(mail);
        const offer = await peerConnections.current[mail].createOffer();
        await peerConnections.current[mail].setLocalDescription(offer);
        socket.current?.send(JSON.stringify({ type: 'offer', to: mail, data: offer }));
        console.log(`📤 ${mail}에게 Offer 전송`);
        break;
      }
      
      case 'offer': {
        if (!audioStream.current) await getLocalAudioStream();
        setupPeerConnection(mail);
        await peerConnections.current[mail].setRemoteDescription(new RTCSessionDescription(data));
        const answer = await peerConnections.current[mail].createAnswer();
        await peerConnections.current[mail].setLocalDescription(answer);
        socket.current?.send(JSON.stringify({ type: 'answer', to: mail, data: answer }));
        console.log(`📤 ${mail}에게 Answer 전송`);
        break;
      }
      case 'answer': {
        await peerConnections.current[mail].setRemoteDescription(new RTCSessionDescription(mail));
        console.log(`✅ ${mail}의 Answer 설정 완료`);
        break;
      }
      case 'candidate': {
        if (data) {
          await peerConnections.current[mail].addIceCandidate(new RTCIceCandidate(data));
          console.log(`✅ ${mail}의 ICE 후보 추가`);
        } else {
          console.warn(`⚠️ ${mail}에게 받은 ICE 후보가 null`);
        }
        break;
      }
      default:
        console.warn('❓ 알 수 없는 메시지 타입:', type);
    }
  }

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
