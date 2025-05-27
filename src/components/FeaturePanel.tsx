import styled from 'styled-components'
import { Instrument, Volume } from '../assets'
import { FeatureButton } from './InstrumentButton'
import { RangeInput } from './RangeCustom'
import { InstrumentType } from '../utils/type'
import { InstrumentList } from './Instrument'

interface Props {
  activeFeature: 'instrument' | 'volume' | null
  handleToggleFeature: (type: 'instrument' | 'volume') => void
  activeInstrument?: InstrumentType
  handleToggleInstrument?: (instrument: InstrumentType) => void
  handleChangeVolume?: (volume: number) => void
}

export const FeaturePanel = ({ activeFeature, handleToggleFeature, activeInstrument, handleChangeVolume, handleToggleInstrument }: Props) => {
  return (
    <>
      <Position>
        <FeatureButton onClick={() => handleToggleFeature('instrument')} isActive={activeFeature === 'instrument'}>
          <Instrument Fill={activeFeature === 'instrument' ? '#F75C3C' : '#3F3F46'} />
        </FeatureButton>
        {activeFeature === 'instrument' && <InstrumentList onSelectInstrument={handleToggleInstrument} activeInstrument={activeInstrument} />}
      </Position>
      <Position>
        <FeatureButton onClick={() => handleToggleFeature('volume')} isActive={activeFeature === 'volume'}>
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
