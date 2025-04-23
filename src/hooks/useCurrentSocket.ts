import { useCallback, useEffect, useRef, useState } from 'react'
import { RoomSocketType } from '../utils/type'
import { cookie } from '../utils/Auth'

const BASE_URL = import.meta.env.VITE_BASE_URL

export const useConcertSocket = (roomId: string) => {
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
    if (ws.current) ws.current.close()

    ws.current = new WebSocket(`wss://${BASE_URL}/ws/rooms/${roomId}?token=${cookie.get('access_token')}`)

    ws.current.onopen = () => console.log('소켓 연결 성공')
    ws.current.onerror = (error) => console.error('[소켓 에러]', error)
    ws.current.onmessage = ({ data: res }) => {
      const parsed = JSON.parse(res)
      let payload
      try {
        payload = typeof parsed.payload === 'string' ? JSON.parse(parsed.payload) : parsed.payload
      } catch (e) {
        console.error('payload 파싱 실패:', e)
        payload = parsed.payload
      }
      setData({ ...parsed, payload })
    }
    ws.current.onclose = (event) => console.log(`[소켓 종료] code: ${event.code}, reason: ${event.reason}`)
  }, [roomId])

  useEffect(() => {
    handleSocket()
  }, [handleSocket])

  return { data, KickMember }
}
