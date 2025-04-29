import { useEffect, useRef, useState } from 'react'

export const useMicrophone = () => {
  const [mikeOn, setMikeOn] = useState(true)
  const audioStream = useRef<MediaStream | null>(null)

  useEffect(() => {
    navigator.mediaDevices.getUserMedia({ audio: true })
      .then((stream) => {
        audioStream.current = stream
        stream.getAudioTracks().forEach((track) => (track.enabled = mikeOn))
      })
      .catch((err) => {
        console.error('마이크 접근 실패:', err)
      })

    return () => {
      if (audioStream.current) {
        audioStream.current.getTracks().forEach((track) => track.stop())
      }
    }
  }, [])

  useEffect(() => {
    if (audioStream.current) {
      audioStream.current.getAudioTracks().forEach((track) => {
        track.enabled = mikeOn
      })
    }
  }, [mikeOn])

  const toggleMike = () => setMikeOn((prev) => !prev)

  return { mikeOn, toggleMike, audioStream }
}
