import { useEffect, useRef } from 'react';
import { cookie } from '../utils/Auth';

const SERVER_URL = import.meta.env.VITE_BASE_URL;

export const useAudioConnection = (roomId: string, audioStream: React.RefObject<MediaStream | null>) => {
  const socket = useRef<WebSocket | null>(null);
  const myPeerConnection = useRef<RTCPeerConnection | null>(null);

  const iceServers = [
    {
      urls: "stun:stun.l.google.com:19302",
    },
  ];

  

  const createPeerConnection = () => {
    const peerConnection = new RTCPeerConnection({ iceServers });

    peerConnection.onicecandidate = (event) => {
      if (event.candidate) {
        socket.current?.send(JSON.stringify({ type: 'ice-candidate', candidate: event.candidate }));
      }
    };

    peerConnection.ontrack = (event) => {
      const [remoteStream] = event.streams;
      if (remoteStream) {
        const remoteAudioElement = document.getElementById('remote-audio') as HTMLAudioElement;
        if (remoteAudioElement) {
          remoteAudioElement.srcObject = remoteStream;
          remoteAudioElement.play().catch((err) => console.error('오디오 재생 실패', err));
        }
      }
    };

    // 내 오디오 스트림 추가
    if (audioStream.current) {
      audioStream.current.getTracks().forEach((track) => {
        peerConnection.addTrack(track, audioStream.current!);
      });
    }

    myPeerConnection.current = peerConnection;
  };

  useEffect(() => {
    socket.current = new WebSocket(`wss://${SERVER_URL}ws/rooms/${roomId}?token=${cookie.get('access_token')}`);

    socket.current.onopen = () => {
      console.log("✅ WebSocket 연결 성공");
      socket.current?.send(JSON.stringify({ type: 'join-room', roomId }));
    };

    socket.current.onmessage = async (event) => {
      const message = JSON.parse(event.data);
      console.log('📩 받은 메시지:', message);

      switch (message.type) {
        case 'user-joined':
          console.log('👤 다른 사용자가 방에 들어옴');
          createPeerConnection();

          // [추가] user-joined 받으면 바로 offer 생성하고 보냄
          if (myPeerConnection.current) {
            const offer = await myPeerConnection.current.createOffer();
            await myPeerConnection.current.setLocalDescription(offer);
            socket.current?.send(JSON.stringify({ type: 'offer', sdp: offer }));
            console.log('📤 offer 전송 완료');
          }
          break;

        case 'offer':
          console.log('📩 offer 수신');
          if (!myPeerConnection.current) {
            createPeerConnection();
          }
          if (myPeerConnection.current) {
            await myPeerConnection.current.setRemoteDescription(new RTCSessionDescription(message.sdp));
            const answer = await myPeerConnection.current.createAnswer();
            await myPeerConnection.current.setLocalDescription(answer);
            socket.current?.send(JSON.stringify({ type: 'answer', sdp: answer }));
            console.log('📤 answer 전송 완료');
          }
          break;

        case 'answer':
          console.log('📩 answer 수신');
          if (myPeerConnection.current) {
            await myPeerConnection.current.setRemoteDescription(new RTCSessionDescription(message.sdp));
          }
          break;

        case 'ice-candidate':
          console.log('📩 ice-candidate 수신');
          if (myPeerConnection.current) {
            await myPeerConnection.current.addIceCandidate(new RTCIceCandidate(message.candidate));
          }
          break;
        
        case "join":
          console.log("👤 유저가 입장했습니다, PeerConnection 생성");
          createPeerConnection();
          break;

        default:
          console.warn('🤷‍♂️ 알 수 없는 메시지 타입:', message.type);
          break;
      }
    };

    return () => {
      socket.current?.close();
      myPeerConnection.current?.close();
      console.log('🧹 정리 완료');
    };
  }, [roomId, audioStream]);

  return {
    createPeerConnection,
  };
};
