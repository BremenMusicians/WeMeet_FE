import { useCallback, useEffect, useRef, useState } from 'react'
import { RoomSocketType } from '../utils/type'
import { cookie } from '../utils/Auth'

const BASE_URL = import.meta.env.VITE_BASE_URL

/**
 * WebSocket을 사용하여 실시간 소켓 통신을 관리하는 훅
 * @param {string} roomId - 방 ID
 * @param {(e: MessageEvent) => void} onMessageHandler - 메시지 수신 시 호출되는 핸들러
 * @returns {{ ws: React.RefObject<WebSocket | null>, data: RoomSocketType, KickMember: (email: string) => void }} - WebSocket 객체, 수신된 데이터, 멤버 강퇴 함수
 */
export const useConcertSocket = (roomId: string, onMessageHandler?: (e: MessageEvent) => void) => {
  const ws = useRef<WebSocket | null>(null)
  const [data, setData] = useState<RoomSocketType>()

  const KickMember = (email: string) => {
    const payload = {
      type: 'kick',
      to: email,
      data: null,
    }
    ws.current?.send(JSON.stringify(payload))
  }

  const handleSocket = useCallback(() => {
    if (ws.current && ws.current.readyState === WebSocket.OPEN) {
      console.log('🔁 기존 소켓이 이미 열려 있음')
      return
    }

    if (ws.current) ws.current.close()

    ws.current = new WebSocket(`wss://${BASE_URL}ws/rooms/${roomId}?token=${cookie.get('access_token')}`)

    ws.current.onopen = () => console.log('🧩 소켓 연결 성공')
    ws.current.onerror = (error) => console.error('[소켓 에러]', error)
    ws.current.onmessage = (e) => {
      if (onMessageHandler) onMessageHandler(e)
      try {
        const parsed = JSON.parse(e.data)
        const payload = typeof parsed.payload === 'string' ? JSON.parse(parsed.payload) : parsed.payload
        setData({ ...parsed, payload })
      } catch (err) {
        console.error('❌ 메시지 파싱 실패', err)
      }
    }
    ws.current.onclose = (event) => {
      console.log(`[소켓 종료] code: ${event.code}, reason: ${event}`)
    }
  }, [roomId])

  useEffect(() => {
    handleSocket()
  }, [handleSocket])

  return { ws, data, KickMember }
}
