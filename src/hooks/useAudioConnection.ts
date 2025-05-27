import { useCallback, useEffect, useRef } from 'react'
import { useConcertSocket } from './useCurrentSocket'
import { useParticipantsStore } from '../stores/useParticipantsStore'

interface PeerConnections {
  [mail: string]: RTCPeerConnection
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
  audioRefs: { [mail: string]: React.RefObject<HTMLAudioElement | null> },
  myAccountId: string,
  audioStream: React.RefObject<MediaStream | null>,
  getLocalAudioStream: () => Promise<MediaStream | null>,
) => {
  const roomId = new URLSearchParams(window.location.search).get('id')
  const peerConnections = useRef<PeerConnections>({})
  const candidateQueue = useRef<{ [mail: string]: RTCIceCandidate[] }>({})

  /** PeerConnection 설정 */
  const setupPeerConnection = async (mail: string) => {
    console.log(`🔗 PeerConnection 생성 시작 (${mail})`)

    if (!audioStream.current) {
      console.warn('🔇 audioStream 없음. 스트림을 먼저 가져옵니다.')
      audioStream.current = await getLocalAudioStream()
      console.log('🎤 로컬 오디오 스트림 가져옴 (setupPeerConnection)', audioStream.current)
    }

    const pc = new RTCPeerConnection({
      iceServers: [{ urls: 'stun:stun.l.google.com:19302' }],
    })

    pc.onicecandidate = (event) => {
      if (event.candidate && socket.current?.readyState === WebSocket.OPEN) {
        socket.current.send(
          JSON.stringify({
            type: 'candidate',
            from: myAccountId,
            to: mail,
            data: event.candidate,
          }),
        )
      }
    }

    /**
     * @description 상대방의 오디오 트랙을 수신하고, 해당 오디오 스트림을 지정된 audioRef에 연결합니다.
     * @param {RTCTrackEvent} event - 수신된 트랙 이벤트
     * @param {string} mail - 상대방의 이메일 주소
     * @throws {Error} audioRef가 아직 준비되지 않은 경우, 500ms 후 재시도합니다.
     * @returns {void}
     */
    pc.ontrack = (event) => {
      const remoteStream = event.streams[0]
      console.log('📥 상대방 오디오 수신됨:', remoteStream)

      const participant = useParticipantsStore.getState().participants.find((p) => p.mail === mail)
      const ref = participant?.audioRef

      console.log(`🔍 ${mail}의 audioRef =`, ref)

      if (!ref?.current) {
        console.warn(`⏳ ${mail}의 audio ref 아직 없음. 500ms 후 재시도`)
        setTimeout(() => {
          const delayedParticipant = useParticipantsStore.getState().participants.find((p) => p.mail === mail)
          const delayedRef = delayedParticipant?.audioRef

          if (delayedRef?.current) {
            delayedRef.current.srcObject = remoteStream
            delayedRef.current.onplay = () => {
              console.log(`🔈 ${mail} 오디오 재생 시작됨`)
            }
            delayedRef.current.onerror = (e) => {
              console.error(`❌ ${mail} 오디오 재생 에러`, e)
            }
            delayedRef.current.play().catch(console.error)
          } else {
            console.error(`❌ ${mail}의 audio ref 여전히 없음`)
          }
        }, 500)
        return
      }

      ref.current.srcObject = remoteStream
      ref.current.onplay = () => {
        console.log(`🔈 ${mail} 오디오 재생 시작됨`)
      }
      ref.current.onerror = (e) => {
        console.error(`❌ ${mail} 오디오 재생 에러`, e)
      }
      ref.current.play().catch(console.error)
    }

    if (audioStream.current) {
      const tracks = audioStream.current.getTracks()
      tracks.forEach((track) => {
        pc.addTrack(track, audioStream.current!)
      })

      console.log('🎙️ 오디오 트랙 추가됨:', tracks)
    }

    peerConnections.current[mail] = pc

    const queue = candidateQueue.current[mail]
    if (queue) {
      queue.forEach((candidate) => {
        console.log(`🚀 큐에서 ICE 후보 적용 (${mail})`, candidate)
        pc.addIceCandidate(candidate)
      })
      delete candidateQueue.current[mail]
    }
  }

  /** 메시지 처리 */
  const handleMessage = useCallback(
    async (message: MessageEvent) => {
      const { type, data, from } = JSON.parse(message.data)
      let mail: string

      console.log(`📬 메시지 수신 (${type})`, data)

      if (type === 'candidate' || type === 'offer' || type === 'answer') {
        mail = from
      } else {
        try {
          // data가 문자열이면 파싱, 객체면 그대로 사용
          const parsed = typeof data === 'string' ? JSON.parse(data) : data
          mail = parsed.mail
        } catch (err) {
          console.error('❌ mail 파싱 실패:', err, '원본 data:', data)
          return
        }
      }

      console.log(`📩 수신된 메시지 (${type}) from ${mail}`)

      switch (type) {
        case 'join': {
          console.log(`👋 참가자 입장 (${mail})`)
          const parsed = typeof data === 'string' ? JSON.parse(data) : data
          useParticipantsStore.getState().addParticipant({
            mail: parsed.mail,
            accountId: parsed.accountId,
            profile: parsed.profile,
          })
          if (!audioStream.current) audioStream.current = await getLocalAudioStream()
          console.log('🎤 로컬 오디오 스트림 가져옴 (join)', audioStream.current)
          await setupPeerConnection(mail)

          const offer = await peerConnections.current[mail].createOffer()
          console.log(`📤 Offer 생성 (${mail})`, offer)
          await peerConnections.current[mail].setLocalDescription(offer)
          socket.current?.send(JSON.stringify({ type: 'offer', to: mail, data: offer, from: myAccountId }))
          break
        }

        case 'offer': {
          console.log(`📩 Offer 수신 (${mail})`, data)
          if (!audioStream.current) audioStream.current = await getLocalAudioStream()
          console.log('🎤 로컬 오디오 스트림 가져옴 (offer)', audioStream.current)
          if (!peerConnections.current[mail]) {
            await setupPeerConnection(mail)
          }
          await peerConnections.current[mail].setRemoteDescription(new RTCSessionDescription(data))

          const answer = await peerConnections.current[mail].createAnswer()
          console.log(`📤 Answer 생성 (${mail})`, answer)
          await peerConnections.current[mail].setLocalDescription(answer)
          socket.current?.send(JSON.stringify({ type: 'answer', to: mail, data: answer }))
          const queuedCandidates = candidateQueue.current[mail]
          if (queuedCandidates && peerConnections.current[mail].remoteDescription) {
            for (const c of queuedCandidates) {
              try {
                await peerConnections.current[mail].addIceCandidate(c)
              } catch (err) {
                console.error(`💥 큐에서 ICE 후보 추가 실패 (${mail})`, err)
              }
            }
            delete candidateQueue.current[mail]
          }

          break
        }

        case 'answer': {
          console.log(`📩 Answer 수신 (${mail})`, data)
          await peerConnections.current[mail].setRemoteDescription(new RTCSessionDescription(data))
          const queuedCandidates = candidateQueue.current[mail]
          if (queuedCandidates) {
            for (const c of queuedCandidates) {
              await peerConnections.current[mail].addIceCandidate(c)
            }
            delete candidateQueue.current[mail]
          }

          break
        }

        case 'leave': {
          console.log(`🚪 참가자 퇴장 (${mail})`)

          useParticipantsStore.getState().removeParticipant(mail)

          if (peerConnections.current[mail]) {
            peerConnections.current[mail].close()
            delete peerConnections.current[mail]
          }

          break
        }

        case 'candidate': {
          console.log(`📩 ICE 후보 수신 (${mail})`, data)
          const candidate = new RTCIceCandidate(data)
          const pc = peerConnections.current[mail]

          if (!pc) {
            console.warn(`❌ PeerConnection 없음. 큐에 저장: ${mail}`)
            if (!candidateQueue.current[mail]) {
              candidateQueue.current[mail] = []
            }
            candidateQueue.current[mail].push(candidate)
            return
          }

          if (!pc.remoteDescription || !pc.remoteDescription.type) {
            console.warn(`⏳ 아직 remoteDescription 없음. 큐에 저장: ${mail}`)
            if (!candidateQueue.current[mail]) {
              candidateQueue.current[mail] = []
            }
            candidateQueue.current[mail].push(candidate)
            return
          }

          try {
            await pc.addIceCandidate(candidate)
            console.log(`✅ ICE 후보 추가됨: ${mail}`)
          } catch (err) {
            console.error(`💥 ICE 후보 추가 실패 (${mail})`, err)
          }
          break
        }

        default:
          console.warn('❓ 알 수 없는 메시지 타입:', type)
          break
      }
    },
    [myAccountId, audioRefs, audioStream, getLocalAudioStream],
  )

  const socket = useConcertSocket(roomId!, handleMessage).ws

  /** 소켓 연결 및 종료 */
  useEffect(() => {
    if (!isReady || !socket.current) return

    if (!audioStream.current) {
      getLocalAudioStream().then((stream) => {
        audioStream.current = stream
        console.log('🎤 로컬 오디오 스트림 가져옴 (useEffect)', stream)

        // 🎧 내 오디오도 재생되게 설정
        const myAudio = audioRefs[myAccountId]
        if (myAudio?.current && stream) {
          myAudio.current.srcObject = stream
          myAudio.current.muted = true // 에코 방지
          myAudio.current.play().catch(console.error)
        }
      })
    }

    const s = socket.current
    s.onopen = () => console.log('🔌 WebSocket 연결됨')
    s.onclose = () => console.log('❌ WebSocket 연결 종료됨')
    s.onerror = (e) => console.error('⚠️ WebSocket 에러:', e)

    return () => {
      Object.values(peerConnections.current).forEach((pc) => pc.close())
      if (audioStream.current) {
        audioStream.current.getTracks().forEach((t) => t.stop())
      }
    }
  }, [isReady, socket])

  useEffect(() => {
    if (isReady && socket.current?.readyState === WebSocket.OPEN) {
      console.log(`🚀 소켓 준비 완료. ready 메시지 전송 (${myAccountId})`)
      socket.current.send(JSON.stringify({ type: 'ready', from: myAccountId }))
    }
  }, [isReady, socket])

  return { socket }
}
