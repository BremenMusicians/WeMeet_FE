import styled from 'styled-components'
import { Instrument, Volume } from '../assets'
import { FeatureButton } from './InstrumentButton'
import { InstrumentList } from './Instrument'
import { RangeInput } from './RangeCustom'
import React, { useEffect, useState } from 'react'
import { useAudioConnection } from '../hooks/useAudioConnection'

interface Props {
  activeFeature: 'instrument' | 'volume' | null
  handleToggleFeature: (type: 'instrument' | 'volume') => void
}

export const FeaturePanel = ({ activeFeature, handleToggleFeature }: Props) => {
  const remoteAudioRef = React.useRef<HTMLAudioElement | null>(null)
  const [globalVolume, setGlobalVolume] = useState(1) // 전체 볼륨 상태

  const { audioStream, remoteStream } = useAudioConnection(true, remoteAudioRef)

  // 볼륨 변경 핸들러
  const handleGlobalVolumeChange = (volume: number) => {
    setGlobalVolume(volume)
  }

  // remoteStream의 변화에 따라 audio 태그의 볼륨을 동적으로 설정
  useEffect(() => {
    if (remoteAudioRef.current) {
      remoteAudioRef.current.volume = globalVolume // 볼륨 설정
    }
  }, [globalVolume])

  // remoteStream이 변화할 때마다 다시 렌더링될 수 있도록 처리
  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      remoteAudioRef.current.srcObject = remoteStream.current // 스트림을 audio 요소에 연결
    }
  }, [remoteStream])

  useEffect(() => {
    if (remoteAudioRef.current && remoteStream) {
      ;<audio autoPlay controls ref={remoteAudioRef}></audio>
    }
  }, [remoteStream])

  return (
    <>
      <Position>
        <audio autoPlay controls ref={remoteAudioRef} srcObject={remoteStream}></audio>
        <FeatureButton onClick={() => handleToggleFeature('instrument')} isActive={activeFeature === 'instrument'}>
          <Instrument Fill={activeFeature === 'instrument' ? '#F75C3C' : '#3F3F46'} />
        </FeatureButton>
        {activeFeature === 'instrument' && <InstrumentList activeInstrument="피아노" />}
      </Position>
      <Position>
        <FeatureButton onClick={() => handleToggleFeature('volume')} isActive={activeFeature === 'volume'}>
          <Volume Fill={activeFeature === 'volume' ? '#F75C3C' : '#3F3F46'} />
        </FeatureButton>
        {activeFeature === 'volume' && <RangeInput min={0} max={1} defaultValue={globalVolume} onChange={handleGlobalVolumeChange} />}
      </Position>
    </>
  )
}

const Position = styled.div`
  position: relative;
`
