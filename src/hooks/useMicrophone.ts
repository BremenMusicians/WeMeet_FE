import { useEffect, useRef, useState } from 'react'

/**마이크 접근 및 상태 관리 훅
마이크를 사용하기 위한 훅으로, 마이크의 상태를 관리하고, 마이크 접근을 시도합니다.
마이크가 켜져 있는지 여부를 상태로 관리하며, 마이크를 켜고 끌 수 있는 기능을 제공합니다.
이 훅은 마이크 접근을 시도하고, 성공적으로 접근하면 마이크의 상태를 업데이트합니다.
마이크 접근에 실패하면 에러 메시지를 콘솔에 출력합니다.
마이크 접근이 성공하면, 마이크의 상태를 업데이트하고, 마이크를 끄거나 켜는 기능을 제공합니다.
이 훅은 마이크 접근을 위한 MediaStream을 관리하며, 마이크의 상태가 변경될 때마다 MediaStream의 트랙을 업데이트합니다.
@returns {Object} 마이크 상태와 마이크를 켜고 끌 수 있는 함수, MediaStream을 반환합니다.
@returns {boolean} mikeOn - 마이크가 켜져 있는지 여부
@returns {function} toggleMike - 마이크를 켜고 끌 수 있는 함수
@returns {Ref} audioStream - MediaStream을 참조하는 Ref
@returns {function} getLocalAudioStream - 로컬 오디오 스트림을 가져오는 함수
@throws {Error} 마이크 접근 실패 시 에러를 발생시킵니다.*/
export const useMicrophone = () => {
  const [mikeOn, setMikeOn] = useState(true)
  const audioStream = useRef<MediaStream | null>(null)

  /** 로컬 오디오 스트림을 가져오는 함수
   * @returns {Promise<MediaStream>} 로컬 오디오 스트림
   * @throws {Error} 마이크 접근 실패 시 에러를 발생시킵니다.
   */
  const getLocalAudioStream = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      audioStream.current = stream
      stream.getAudioTracks().forEach((track) => (track.enabled = mikeOn))
      return stream
    } catch (err) {
      console.error('마이크 접근 실패:', err)
      throw err
    }
  }

  useEffect(() => {
    getLocalAudioStream()

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

  /** 마이크 상태를 토글하는 함수
   * @returns {void}
   */
  const toggleMike = () => setMikeOn((prev) => !prev)

  return { mikeOn, toggleMike, audioStream, getLocalAudioStream }
}
