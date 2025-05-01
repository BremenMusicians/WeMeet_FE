import styled from 'styled-components'
import { Instrument, Volume } from '../assets'
import { FeatureButton } from './InstrumentButton'
import { InstrumentList } from './Instrument'
import { RangeInput } from './RangeCustom'

interface Props {
  activeFeature: 'instrument' | 'volume' | null
  handleToggleFeature: (type: 'instrument' | 'volume') => void
}

export const FeaturePanel = ({ activeFeature, handleToggleFeature }: Props) => {
  return (
    <>
      <Position>
        <FeatureButton onClick={() => handleToggleFeature('instrument')} isActive={activeFeature === 'instrument'}>
          <Instrument Fill={activeFeature === 'instrument' ? '#F75C3C' : '#3F3F46'} />
        </FeatureButton>
        {activeFeature === 'instrument' && <InstrumentList activeInstrument="피아노" />}
      </Position>
      <Position>
        <FeatureButton onClick={() => handleToggleFeature('volume')} isActive={activeFeature === 'volume'}>
          <Volume Fill={activeFeature === 'volume' ? '#F75C3C' : '#3F3F46'} />
        </FeatureButton>
        {activeFeature === 'volume' && <RangeInput />}
      </Position>
    </>
  )
}

const Position = styled.div`
  position: relative;
`
