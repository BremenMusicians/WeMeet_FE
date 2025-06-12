import styled from 'styled-components'
import { Instrument, Volume } from '../assets'
import { FeatureButton } from './InstrumentButton'
import { RangeInput } from './RangeCustom'
import { InstrumentType } from '../utils/type'
import { InstrumentList } from './Instrument'
import { useEffect, useRef } from 'react'

interface Props {
  activeFeature: 'instrument' | 'volume' | null
  handleToggleFeature: (type: 'instrument' | 'volume' | null) => void
  activeInstrument?: InstrumentType | undefined
  handleToggleInstrument?: (instrument: InstrumentType) => void
  handleChangeVolume?: (volume: number) => void
}

export const FeaturePanel = ({ activeFeature, handleToggleFeature, activeInstrument, handleChangeVolume, handleToggleInstrument }: Props) => {
  const instrumentRef = useRef<HTMLDivElement>(null)
  const volumeRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const instrumentClicked = instrumentRef.current && instrumentRef.current.contains(event.target as Node)
      const volumeClicked = volumeRef.current && volumeRef.current.contains(event.target as Node)

      if (!instrumentClicked && !volumeClicked) {
        handleToggleFeature(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [activeFeature, handleToggleFeature])

  return (
    <>
      <Position ref={instrumentRef}>
        <FeatureButton onClick={() => handleToggleFeature(activeFeature === 'instrument' ? null : 'instrument')} isActive={activeFeature === 'instrument'}>
          <Instrument Fill={activeFeature === 'instrument' ? '#F75C3C' : '#3F3F46'} />
        </FeatureButton>
        {activeFeature === 'instrument' && (
          <InstrumentList
            onSelectInstrument={(instrument) => {
              handleToggleInstrument?.(instrument)
              handleToggleFeature(null)
            }}
            activeInstrument={activeInstrument}
          />
        )}
      </Position>

      <Position ref={volumeRef}>
        <FeatureButton onClick={() => handleToggleFeature(activeFeature === 'volume' ? null : 'volume')} isActive={activeFeature === 'volume'}>
          <Volume Fill={activeFeature === 'volume' ? '#F75C3C' : '#3F3F46'} />
        </FeatureButton>
        {activeFeature === 'volume' && <RangeInput onChange={handleChangeVolume} />}
      </Position>
    </>
  )
}

const Position = styled.div`
  position: relative;
`
