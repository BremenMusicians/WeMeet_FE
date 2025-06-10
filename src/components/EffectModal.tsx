import styled from 'styled-components'
import { useState, useEffect } from 'react'
import { Double_Arrow } from '../assets'

// 이펙터 타입 정의
type EffectType = 'reverb' | 'delay' | 'distortion' | 'eq' | 'compressor'

// 이펙터 상태 인터페이스
interface EffectState {
  enabled: boolean
  params: {
    [key: string]: number
  }
}

// 이펙터 초기 상태
const initialEffectsState: Record<EffectType, EffectState> = {
  reverb: {
    enabled: false,
    params: {
      decay: 2.0,
      mix: 0.5,
    },
  },
  delay: {
    enabled: false,
    params: {
      time: 0.3,
      feedback: 0.4,
      mix: 0.5,
    },
  },
  distortion: {
    enabled: false,
    params: {
      gain: 0.4,
      tone: 0.6,
    },
  },
  eq: {
    enabled: false,
    params: {
      low: 0,
      mid: 0,
      high: 0,
    },
  },
  compressor: {
    enabled: false,
    params: {
      threshold: -24,
      ratio: 4,
      attack: 0.003,
      release: 0.25,
    },
  },
}

export const EffectModal = () => {
  const [openSidebar, setOpenSidebar] = useState<boolean>(true)
  const [effects, setEffects] = useState<Record<EffectType, EffectState>>(initialEffectsState)
  const [expandedEffect, setExpandedEffect] = useState<EffectType | null>(null)

  // 이펙터 토글 핸들러
  const toggleEffect = (effectType: EffectType) => {
    setEffects((prev) => ({
      ...prev,
      [effectType]: {
        ...prev[effectType],
        enabled: !prev[effectType].enabled,
      },
    }))
  }

  // 이펙터 파라미터 변경 핸들러
  const updateEffectParam = (effectType: EffectType, paramName: string, value: number) => {
    setEffects((prev) => ({
      ...prev,
      [effectType]: {
        ...prev[effectType],
        params: {
          ...prev[effectType].params,
          [paramName]: value,
        },
      },
    }))
  }

  // 패널 확장/축소 핸들러
  const toggleExpand = (effectType: EffectType) => {
    setExpandedEffect(expandedEffect === effectType ? null : effectType)
  }
  return (
    <Sidebar $isOpen={openSidebar}>
      <CloseButton onClick={() => setOpenSidebar(!openSidebar)}>
        <Double_Arrow direction={openSidebar ? 'left' : 'right'} Fill="#a1a1aa" />
      </CloseButton>
      <TitleBox>
        <Title>이펙터</Title>
      </TitleBox>

      {/* 리버브 이펙터 */}
      <EffectPanel expanded={expandedEffect === 'reverb'}>
        <EffectHeader>
          <EffectName>리버브</EffectName>
          <EffectControls>
            <ToggleSwitch $isActive={effects.reverb.enabled} onClick={() => toggleEffect('reverb')}>
              <ToggleSwitchKnob $isActive={effects.reverb.enabled} />
            </ToggleSwitch>
            <ExpandButton onClick={() => toggleExpand('reverb')}>{expandedEffect === 'reverb' ? '▲' : '▼'}</ExpandButton>
          </EffectControls>
        </EffectHeader>
        <EffectContent $isVisible={expandedEffect === 'reverb'}>
          <EffectParam>
            <ParamLabel>감쇠</ParamLabel>
            <ParamSliderContainer>
              <ParamValue>{effects.reverb.params.decay.toFixed(1)}</ParamValue>
              <ParamSlider type="range" min={0.1} max={10} step={0.1} value={effects.reverb.params.decay} onChange={(e) => updateEffectParam('reverb', 'decay', parseFloat(e.target.value))} />
            </ParamSliderContainer>
          </EffectParam>
          <EffectParam>
            <ParamLabel>믹스</ParamLabel>
            <ParamSliderContainer>
              <ParamValue>{(effects.reverb.params.mix * 100).toFixed(0)}%</ParamValue>
              <ParamSlider type="range" min={0} max={1} step={0.01} value={effects.reverb.params.mix} onChange={(e) => updateEffectParam('reverb', 'mix', parseFloat(e.target.value))} />
            </ParamSliderContainer>
          </EffectParam>
        </EffectContent>
      </EffectPanel>

      {/* 딜레이 이펙터 */}
      <EffectPanel expanded={expandedEffect === 'delay'}>
        <EffectHeader>
          <EffectName>딜레이</EffectName>
          <EffectControls>
            <ToggleSwitch $isActive={effects.delay.enabled} onClick={() => toggleEffect('delay')}>
              <ToggleSwitchKnob $isActive={effects.delay.enabled} />
            </ToggleSwitch>
            <ExpandButton onClick={() => toggleExpand('delay')}>{expandedEffect === 'delay' ? '▲' : '▼'}</ExpandButton>
          </EffectControls>
        </EffectHeader>
        <EffectContent $isVisible={expandedEffect === 'delay'}>
          <EffectParam>
            <ParamLabel>타임</ParamLabel>
            <ParamSliderContainer>
              <ParamValue>{effects.delay.params.time.toFixed(2)}s</ParamValue>
              <ParamSlider type="range" min={0.05} max={1} step={0.01} value={effects.delay.params.time} onChange={(e) => updateEffectParam('delay', 'time', parseFloat(e.target.value))} />
            </ParamSliderContainer>
          </EffectParam>
          <EffectParam>
            <ParamLabel>피드백</ParamLabel>
            <ParamSliderContainer>
              <ParamValue>{(effects.delay.params.feedback * 100).toFixed(0)}%</ParamValue>
              <ParamSlider type="range" min={0} max={0.9} step={0.01} value={effects.delay.params.feedback} onChange={(e) => updateEffectParam('delay', 'feedback', parseFloat(e.target.value))} />
            </ParamSliderContainer>
          </EffectParam>
          <EffectParam>
            <ParamLabel>믹스</ParamLabel>
            <ParamSliderContainer>
              <ParamValue>{(effects.delay.params.mix * 100).toFixed(0)}%</ParamValue>
              <ParamSlider type="range" min={0} max={1} step={0.01} value={effects.delay.params.mix} onChange={(e) => updateEffectParam('delay', 'mix', parseFloat(e.target.value))} />
            </ParamSliderContainer>
          </EffectParam>
        </EffectContent>
      </EffectPanel>

      {/* 디스토션 이펙터 */}
      <EffectPanel expanded={expandedEffect === 'distortion'}>
        <EffectHeader>
          <EffectName>디스토션</EffectName>
          <EffectControls>
            <ToggleSwitch $isActive={effects.distortion.enabled} onClick={() => toggleEffect('distortion')}>
              <ToggleSwitchKnob $isActive={effects.distortion.enabled} />
            </ToggleSwitch>
            <ExpandButton onClick={() => toggleExpand('distortion')}>{expandedEffect === 'distortion' ? '▲' : '▼'}</ExpandButton>
          </EffectControls>
        </EffectHeader>
        <EffectContent $isVisible={expandedEffect === 'distortion'}>
          <EffectParam>
            <ParamLabel>게인</ParamLabel>
            <ParamSliderContainer>
              <ParamValue>{(effects.distortion.params.gain * 100).toFixed(0)}%</ParamValue>
              <ParamSlider type="range" min={0} max={1} step={0.01} value={effects.distortion.params.gain} onChange={(e) => updateEffectParam('distortion', 'gain', parseFloat(e.target.value))} />
            </ParamSliderContainer>
          </EffectParam>
          <EffectParam>
            <ParamLabel>톤</ParamLabel>
            <ParamSliderContainer>
              <ParamValue>{(effects.distortion.params.tone * 100).toFixed(0)}%</ParamValue>
              <ParamSlider type="range" min={0} max={1} step={0.01} value={effects.distortion.params.tone} onChange={(e) => updateEffectParam('distortion', 'tone', parseFloat(e.target.value))} />
            </ParamSliderContainer>
          </EffectParam>
        </EffectContent>
      </EffectPanel>

      {/* EQ 이펙터 */}
      <EffectPanel expanded={expandedEffect === 'eq'}>
        <EffectHeader>
          <EffectName>이퀄라이저</EffectName>
          <EffectControls>
            <ToggleSwitch $isActive={effects.eq.enabled} onClick={() => toggleEffect('eq')}>
              <ToggleSwitchKnob $isActive={effects.eq.enabled} />
            </ToggleSwitch>
            <ExpandButton onClick={() => toggleExpand('eq')}>{expandedEffect === 'eq' ? '▲' : '▼'}</ExpandButton>
          </EffectControls>
        </EffectHeader>
        <EffectContent $isVisible={expandedEffect === 'eq'}>
          <EqContainer>
            <EqBand>
              <EqSlider type="range" min={-12} max={12} step={1} value={effects.eq.params.low} onChange={(e) => updateEffectParam('eq', 'low', parseFloat(e.target.value))} />
              <EqLabel>저음</EqLabel>
              <EqValue>{effects.eq.params.low > 0 ? `+${effects.eq.params.low}` : effects.eq.params.low}dB</EqValue>
            </EqBand>
            <EqBand>
              <EqSlider type="range" min={-12} max={12} step={1} value={effects.eq.params.mid} onChange={(e) => updateEffectParam('eq', 'mid', parseFloat(e.target.value))} />
              <EqLabel>중음</EqLabel>
              <EqValue>{effects.eq.params.mid > 0 ? `+${effects.eq.params.mid}` : effects.eq.params.mid}dB</EqValue>
            </EqBand>
            <EqBand>
              <EqSlider type="range" min={-12} max={12} step={1} value={effects.eq.params.high} onChange={(e) => updateEffectParam('eq', 'high', parseFloat(e.target.value))} />
              <EqLabel>고음</EqLabel>
              <EqValue>{effects.eq.params.high > 0 ? `+${effects.eq.params.high}` : effects.eq.params.high}dB</EqValue>
            </EqBand>
          </EqContainer>
        </EffectContent>
      </EffectPanel>

      {/* 컴프레서 이펙터 */}
      <EffectPanel expanded={expandedEffect === 'compressor'}>
        <EffectHeader>
          <EffectName>컴프레서</EffectName>
          <EffectControls>
            <ToggleSwitch $isActive={effects.compressor.enabled} onClick={() => toggleEffect('compressor')}>
              <ToggleSwitchKnob $isActive={effects.compressor.enabled} />
            </ToggleSwitch>
            <ExpandButton onClick={() => toggleExpand('compressor')}>{expandedEffect === 'compressor' ? '▲' : '▼'}</ExpandButton>
          </EffectControls>
        </EffectHeader>
        <EffectContent $isVisible={expandedEffect === 'compressor'}>
          <EffectParam>
            <ParamLabel>쓰레숄드</ParamLabel>
            <ParamSliderContainer>
              <ParamValue>{effects.compressor.params.threshold}dB</ParamValue>
              <ParamSlider
                type="range"
                min={-60}
                max={0}
                step={1}
                value={effects.compressor.params.threshold}
                onChange={(e) => updateEffectParam('compressor', 'threshold', parseFloat(e.target.value))}
              />
            </ParamSliderContainer>
          </EffectParam>
          <EffectParam>
            <ParamLabel>비율</ParamLabel>
            <ParamSliderContainer>
              <ParamValue>{effects.compressor.params.ratio}:1</ParamValue>
              <ParamSlider type="range" min={1} max={20} step={0.5} value={effects.compressor.params.ratio} onChange={(e) => updateEffectParam('compressor', 'ratio', parseFloat(e.target.value))} />
            </ParamSliderContainer>
          </EffectParam>
          <EffectParam>
            <ParamLabel>어택</ParamLabel>
            <ParamSliderContainer>
              <ParamValue>{effects.compressor.params.attack * 1000}ms</ParamValue>
              <ParamSlider
                type="range"
                min={0.001}
                max={0.1}
                step={0.001}
                value={effects.compressor.params.attack}
                onChange={(e) => updateEffectParam('compressor', 'attack', parseFloat(e.target.value))}
              />
            </ParamSliderContainer>
          </EffectParam>
          <EffectParam>
            <ParamLabel>릴리즈</ParamLabel>
            <ParamSliderContainer>
              <ParamValue>{effects.compressor.params.release * 1000}ms</ParamValue>
              <ParamSlider
                type="range"
                min={0.05}
                max={1}
                step={0.01}
                value={effects.compressor.params.release}
                onChange={(e) => updateEffectParam('compressor', 'release', parseFloat(e.target.value))}
              />
            </ParamSliderContainer>
          </EffectParam>
        </EffectContent>
      </EffectPanel>

      <ResetButtonContainer>
        <ResetButton onClick={() => setEffects(initialEffectsState)}>이펙터 초기화</ResetButton>
      </ResetButtonContainer>
    </Sidebar>
  )
}

const Sidebar = styled.div<{ $isOpen: boolean }>`
  width: 240px;
  height: 560px;
  background-color: ${({ theme }) => theme.color.gray50};
  position: fixed;
  right: ${({ $isOpen }) => ($isOpen ? 16 : -240)}px;
  transition: all;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  box-shadow: 0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1);
  padding: 20px;
  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
`

const TitleBox = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  margin-bottom: 16px;
`

const Title = styled.p`
  font-weight: 600;
  font-size: 16px;
`

const CloseButton = styled.button`
  padding: 2px;
  border-radius: 8px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  background-color: ${({ theme }) => theme.color.gray100};
  position: fixed;
  right: 30px;
  top: 114px;
  cursor: pointer;
`

const EffectPanel = styled.div<{ expanded: boolean }>`
  background-color: ${({ theme }) => theme.color.gray100};
  border-radius: 6px;
  overflow: hidden;
  margin-bottom: 10px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
`

const EffectHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 8px 12px;
  cursor: pointer;
`

const EffectName = styled.p`
  font-weight: 500;
  font-size: 14px;
`

const EffectControls = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ToggleSwitch = styled.div<{ $isActive: boolean }>`
  width: 32px;
  height: 16px;
  background-color: ${({ $isActive, theme }) => ($isActive ? theme.color.gray500 : theme.color.gray300)};
  border-radius: 10px;
  position: relative;
  cursor: pointer;
  transition: background-color 0.2s;
`

const ToggleSwitchKnob = styled.div<{ $isActive: boolean }>`
  width: 14px;
  height: 14px;
  background-color: white;
  border-radius: 50%;
  position: absolute;
  top: 1px;
  left: ${({ $isActive }) => ($isActive ? '17px' : '1px')};
  transition: left 0.2s;
`

const ExpandButton = styled.button`
  background: none;
  border: none;
  cursor: pointer;
  font-size: 12px;
  color: ${({ theme }) => theme.color.gray600};
  padding: 0;
  display: flex;
  align-items: center;
  justify-content: center;
`

const EffectContent = styled.div<{ $isVisible: boolean }>`
  max-height: ${({ $isVisible }) => ($isVisible ? '500px' : '0')};
  overflow: hidden;
  transition: max-height 0.3s ease-in-out;
  padding: ${({ $isVisible }) => ($isVisible ? '0 12px 12px' : '0 12px')};
`

const EffectParam = styled.div`
  margin-bottom: 8px;
`

const ParamLabel = styled.p`
  font-size: 12px;
  color: ${({ theme }) => theme.color.gray600};
  margin-bottom: 4px;
`

const ParamSliderContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const ParamValue = styled.span`
  font-size: 11px;
  color: ${({ theme }) => theme.color.gray800};
  min-width: 40px;
  text-align: left;
`

const ParamSlider = styled.input`
  flex: 1;
  -webkit-appearance: none;
  height: 4px;
  background: ${({ theme }) => theme.color.gray300};
  outline: none;
  border-radius: 2px;

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.color.gray500};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.color.gray500};
    cursor: pointer;
    border: none;
  }
`

const EqContainer = styled.div`
  display: flex;
  justify-content: space-between;
  gap: 5px;
`

const EqBand = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  width: 60px;
`

const EqSlider = styled.input`
  -webkit-appearance: none;
  width: 4px;
  height: 80px;
  background: ${({ theme }) => theme.color.gray300};
  outline: none;
  border-radius: 2px;
  transform: rotate(180deg);

  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.color.gray500};
    cursor: pointer;
  }

  &::-moz-range-thumb {
    width: 12px;
    height: 12px;
    border-radius: 50%;
    background: ${({ theme }) => theme.color.gray500};
    cursor: pointer;
    border: none;
  }
`

const EqLabel = styled.span`
  font-size: 12px;
  color: ${({ theme }) => theme.color.gray600};
  margin-top: 4px;
`

const EqValue = styled.span`
  font-size: 10px;
  color: ${({ theme }) => theme.color.gray600};
  margin-top: 2px;
`

const ResetButtonContainer = styled.div`
  display: flex;
  justify-content: center;
  margin-top: 12px;
`

const ResetButton = styled.button`
  background-color: ${({ theme }) => theme.color.gray200};
  color: ${({ theme }) => theme.color.gray700};
  border: none;
  border-radius: 4px;
  padding: 6px 12px;
  font-size: 12px;
  cursor: pointer;
  transition: background-color 0.2s;

  &:hover {
    background-color: ${({ theme }) => theme.color.gray300};
  }
`
