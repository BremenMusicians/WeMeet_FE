import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { useConcertSocket } from './useCurrentSocket';
import React from 'react';

export const useAudioConnection = (isReady: boolean, remoteAudioRef: React.RefObject<HTMLAudioElement | null>) => {
  const searchParams = new URLSearchParams(useLocation().search);
  const roomId = searchParams.get('id');

  const { ws: socket } = useConcertSocket(roomId!);
  const myPeerConnection = useRef<RTCPeerConnection | null>(null);
  const audioStream = useRef<MediaStream | null>(null);
  const remoteStream = useRef<MediaStream>(new MediaStream());

  const getLocalAudioStream = async () => {
    console.log('Attempting to get local audio stream...'); // 로그 추가
    try {
      audioStream.current = await navigator.mediaDevices.getUserMedia({ audio: true });
      console.log('🎙️ 마이크 스트림 상태:', audioStream.current); // 성공 로그
      console.log('Local audio tracks:', audioStream.current.getTracks()); // 로그 추가
    } catch (error) {
      console.error('🚫 마이크 접근 실패:', error); // 실패 로그
      // 마이크 접근 실패 시 사용자에게 알림 또는 대체 처리 필요
    }
  };

  const setupPeerConnection = () => {
    console.log('Setting up PeerConnection...'); // 로그 추가
    myPeerConnection.current = new RTCPeerConnection();
    console.log('PeerConnection created:', myPeerConnection.current); // 로그 추가

    myPeerConnection.current.onicecandidate = (event) => {
      console.log('ICE candidate event:', event.candidate); // 로그 추가
      if (event.candidate) {
        socket.current?.send(JSON.stringify({ type: 'candidate', payload: event.candidate }));
        console.log('📤 Candidate 전송 완료'); // 로그 추가
      } else {
        console.log('ICE gathering complete.'); // 로그 추가 (candidate 수집 완료)
      }
    };

    myPeerConnection.current.ontrack = (event) => {
      console.log('🔛 ontrack event received:', event); // 로그 추가
      console.log('Received streams:', event.streams); // 로그 추가
      console.log('Received tracks:', event.streams[0]?.getTracks()); // 로그 추가

      event.streams[0].getTracks().forEach((track) => remoteStream.current.addTrack(track));

      if (remoteAudioRef.current) {
        remoteAudioRef.current.srcObject = remoteStream.current;
        console.log('✅ remoteAudioRef.current에 스트림 연결 완료:', remoteAudioRef.current); // 성공 로그
        remoteAudioRef.current.play().catch(e => console.error("Audio play failed:", e)); // 자동 재생 실패 시 로그
      } else {
         console.warn('❌ remoteAudioRef.current가 아직 null입니다.'); // 경고 로그
      }
    };

    if (audioStream.current) {
      console.log('Adding local audio tracks to PeerConnection...'); // 로그 추가
      audioStream.current.getTracks().forEach((track) => {
        myPeerConnection.current?.addTrack(track, audioStream.current!);
        console.log('Track added:', track); // 로그 추가
      });
    } else {
       console.warn('⚠️ Local audio stream not available when setting up PeerConnection.'); // 경고 로그
       // getLocalAudioStream 호출 시점 또는 완료 여부 확인 필요
    }

    // PeerConnection 상태 변화 로깅
    myPeerConnection.current.onconnectionstatechange = () => {
        console.log(`PeerConnection State: ${myPeerConnection.current?.connectionState}`);
    };
    myPeerConnection.current.oniceconnectionstatechange = () => {
        console.log(`ICE Connection State: ${myPeerConnection.current?.iceConnectionState}`);
    };
    myPeerConnection.current.onsignalingstatechange = () => {
        console.log(`Signaling State: ${myPeerConnection.current?.signalingState}`);
    };
  };

  const createAndSendOffer = async () => {
    if (!myPeerConnection.current) {
        console.warn('❌ PeerConnection not ready to create offer.'); // 로그 추가
        return;
    }
    console.log('Creating offer...'); // 로그 추가
    try {
        const offer = await myPeerConnection.current.createOffer();
        await myPeerConnection.current.setLocalDescription(offer);
        socket.current?.send(JSON.stringify({ type: 'offer', payload: offer }));
        console.log('📤 Offer 전송 완료:', offer); // 로그 추가
    } catch (error) {
        console.error('🚫 Failed to create or send offer:', error); // 실패 로그
    }
  };

  const handleMessage = async (message: MessageEvent) => {
    const { type, payload } = JSON.parse(message.data);
    console.log('📩 받은 메시지 타입:', type); // 로그 추가

    switch (type) {
      case 'join':
        console.log('🆕 상대방 join 이벤트 수신 - offer 생성 시작');
        if (!audioStream.current) {
           await getLocalAudioStream();
        }
        // getLocalAudioStream이 비동기이므로, 스트림이 확보된 후에 PeerConnection 설정을 시작해야 합니다.
        // 현재 로직은 getLocalAudioStream 완료를 기다리지 않고 바로 setupPeerConnection을 호출할 수 있습니다.
        // 필요하다면 Promise 체이닝 등으로 비동기 처리를 명확히 할 수 있습니다.
        setupPeerConnection();
        await createAndSendOffer();
        break;

        case 'offer': {
          console.log('📨 Offer 수신 - answer 생성');
          if (!audioStream.current) {
            await getLocalAudioStream();
          }
          // 마찬가지로 스트림 확보 후 PeerConnection 설정 시작
          setupPeerConnection();
          if (myPeerConnection.current) {
            try {
              await myPeerConnection.current.setRemoteDescription(new RTCSessionDescription(payload));
              const answer = await myPeerConnection.current.createAnswer();
              await myPeerConnection.current.setLocalDescription(answer);
              socket.current?.send(JSON.stringify({ type: 'answer', payload: answer }));
              console.log('📤 Answer 전송 완료:', answer); // 로그 추가
            } catch (error) {
               console.error('🚫 Failed to set remote description or create/send answer:', error); // 실패 로그
            }
          } else {
              console.warn('❌ PeerConnection not ready to handle offer.'); // 로그 추가
          }
          break;
        }

      case 'answer':
        console.log('📨 Answer 수신 - remoteDescription 설정');
        if (myPeerConnection.current) {
            try {
              await myPeerConnection.current.setRemoteDescription(new RTCSessionDescription(payload));
              console.log('✅ Remote description (answer) 설정 완료.'); // 로그 추가
            } catch (error) {
               console.error('🚫 Failed to set remote description (answer):', error); // 실패 로그
            }
        } else {
            console.warn('❌ PeerConnection not ready to handle answer.'); // 로그 추가
        }
        break;

      case 'candidate':
        console.log('📨 Candidate 수신 - ICE 추가 시도'); // 로그 추가
        if (myPeerConnection.current && payload) {
             try {
                await myPeerConnection.current.addIceCandidate(new RTCIceCandidate(payload));
                console.log('✅ ICE Candidate 추가 완료.'); // 로그 추가
             } catch (error) {
                console.error('🚫 Failed to add ICE candidate:', error); // 실패 로그
                // ICE candidate 추가 실패는 네트워크 환경 문제일 수 있습니다.
             }
        } else {
            console.warn('❌ PeerConnection or payload not ready to add candidate.'); // 로그 추가
        }
        break;

      default:
        console.warn('❓ 알 수 없는 메시지 타입:', type);
    }
  };

  useEffect(() => {
    if (!isReady || !socket.current) {
      console.log('WebSocket connection not ready yet or socket is null.'); // 로그 추가
      return;
    }

    console.log('✅ Setting up WebSocket message handler.'); // 로그 추가
    const s = socket.current;
    s.onmessage = handleMessage;

    // 소켓 연결 상태 확인
    s.onopen = () => console.log('WebSocket connection opened.');
    s.onclose = () => console.log('WebSocket connection closed.');
    s.onerror = (error) => console.error('WebSocket error:', error);

    return () => {
      console.log('❎ Cleaning up WebSocket message handler.'); // 로그 추가
      s.onmessage = null;
      s.onopen = null;
      s.onclose = null;
      s.onerror = null;

      // 컴포넌트 언마운트 시 PeerConnection 정리
      if (myPeerConnection.current) {
          myPeerConnection.current.close();
          console.log('PeerConnection closed on cleanup.');
      }
      // 로컬 스트림 중지
      if (audioStream.current) {
          audioStream.current.getTracks().forEach(track => track.stop());
          console.log('Local audio stream tracks stopped on cleanup.');
      }
    };
  }, [socket, isReady, remoteAudioRef]); // 의존성 배열에 remoteAudioRef 추가

   // 추가: socket이 연결되면 "ready" 메시지를 보낼 수 있도록 useEffect 추가
   useEffect(() => {
      if (isReady && socket.current?.readyState === WebSocket.OPEN) {
          console.log('Sending "ready" message via WebSocket.');
          socket.current.send(JSON.stringify({ type: 'ready' })); // 예시: 소켓 준비 완료 알림
      }
   }, [isReady, socket]);
};
