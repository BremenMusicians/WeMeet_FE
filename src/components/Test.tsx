import React, { useEffect, useRef, useState } from 'react'
import * as Tone from 'tone'

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
      roomSize: 0.8,
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

// 피아노 노트 배열
const pianoNotes: string[] = ['C4', 'C#4', 'D4', 'D#4', 'E4', 'F4', 'F#4', 'G4', 'G#4', 'A4', 'A#4', 'B4', 'C5', 'C#5', 'D5', 'D#5', 'E5', 'F5', 'F#5', 'G5', 'G#5', 'A5', 'A#5', 'B5']

// 이펙터 체인 클래스
class ToneEffectsChain {
  private reverb: Tone.Reverb
  private delay: Tone.FeedbackDelay
  private distortion: Tone.Distortion
  private eq: Tone.EQ3
  private compressor: Tone.Compressor
  private effectsChain: Tone.ToneAudioNode[]
  private wetGains: Map<EffectType, Tone.Gain>

  constructor() {
    // 이펙터 생성
    this.reverb = new Tone.Reverb({
      roomSize: 0.8,
      decay: 2.0,
      wet: 0,
    })

    this.delay = new Tone.FeedbackDelay({
      delayTime: 0.3,
      feedback: 0.4,
      wet: 0,
    })

    this.distortion = new Tone.Distortion({
      distortion: 0.4,
      wet: 0,
    })

    this.eq = new Tone.EQ3({
      low: 0,
      mid: 0,
      high: 0,
    })

    this.compressor = new Tone.Compressor({
      threshold: -24,
      ratio: 4,
      attack: 0.003,
      release: 0.25,
    })

    // 이펙터 체인 구성: 컴프레서 -> 디스토션 -> EQ -> 딜레이 -> 리버브
    this.effectsChain = [this.compressor, this.distortion, this.eq, this.delay, this.reverb]

    // 이펙터 연결
    this.connectEffects()
  }

  private connectEffects() {
    // 순차적으로 이펙터 연결
    for (let i = 0; i < this.effectsChain.length - 1; i++) {
      this.effectsChain[i].connect(this.effectsChain[i + 1])
    }

    // 마지막 이펙터를 마스터 출력에 연결
    this.effectsChain[this.effectsChain.length - 1].toDestination()
  }

  // 이펙터 상태 업데이트
  updateEffect(effectType: EffectType, state: EffectState) {
    switch (effectType) {
      case 'reverb':
        this.reverb.roomSize.value = state.params.roomSize || 0.8
        this.reverb.decay = state.params.decay || 2.0
        this.reverb.wet.value = state.enabled ? state.params.mix || 0.5 : 0
        break

      case 'delay':
        this.delay.delayTime.value = state.params.time || 0.3
        this.delay.feedback.value = state.params.feedback || 0.4
        this.delay.wet.value = state.enabled ? state.params.mix || 0.5 : 0
        break

      case 'distortion':
        this.distortion.distortion = (state.params.gain || 0.4) * 10
        this.distortion.wet.value = state.enabled ? 1 : 0
        break

      case 'eq':
        this.eq.low.value = state.enabled ? state.params.low || 0 : 0
        this.eq.mid.value = state.enabled ? state.params.mid || 0 : 0
        this.eq.high.value = state.enabled ? state.params.high || 0 : 0
        break

      case 'compressor':
        this.compressor.threshold.value = state.params.threshold || -24
        this.compressor.ratio.value = state.params.ratio || 4
        this.compressor.attack.value = state.params.attack || 0.003
        this.compressor.release.value = state.params.release || 0.25
        break
    }
  }

  // 입력 노드 반환 (피아노가 연결될 지점)
  getInput() {
    return this.effectsChain[0]
  }

  // 정리
  dispose() {
    this.effectsChain.forEach((effect) => effect.dispose())
  }
}

// 피아노 컴포넌트
const PianoComponent: React.FC<{ effectsChain: ToneEffectsChain | null }> = ({ effectsChain }) => {
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const synthRef = useRef<Tone.PolySynth | null>(null)

  useEffect(() => {
    // 피아노 신디사이저 생성
    const synth = new Tone.PolySynth(Tone.Synth, {
      oscillator: {
        type: 'sine',
      },
      envelope: {
        attack: 0.02,
        decay: 0.1,
        sustain: 0.8,
        release: 1.0,
      },
    })

    // 이펙터 체인에 연결
    if (effectsChain) {
      synth.connect(effectsChain.getInput())
    } else {
      synth.toDestination()
    }

    synthRef.current = synth

    return () => {
      synth.dispose()
    }
  }, [effectsChain])

  // 키보드 매핑
  const noteMap: { [key: string]: string } = {
    KeyA: 'C4',
    KeyS: 'D4',
    KeyD: 'E4',
    KeyF: 'F4',
    KeyG: 'G4',
    KeyH: 'A4',
    KeyJ: 'B4',
    KeyK: 'C5',
    KeyW: 'C#4',
    KeyE: 'D#4',
    KeyT: 'F#4',
    KeyY: 'G#4',
    KeyU: 'A#4',
  }

  const onKeyDown = async (e: KeyboardEvent) => {
    if (e.repeat) return

    // Tone.js 컨텍스트 시작
    if (Tone.context.state !== 'running') {
      await Tone.start()
    }

    const note = noteMap[e.code]
    if (note && !pressedKeys.has(note) && synthRef.current) {
      setPressedKeys((prev) => new Set(prev).add(note))
      synthRef.current.triggerAttack(note)
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    const note = noteMap[e.code]
    if (note && pressedKeys.has(note) && synthRef.current) {
      setPressedKeys((prev) => {
        const newSet = new Set(prev)
        newSet.delete(note)
        return newSet
      })
      synthRef.current.triggerRelease(note)
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.removeEventListener('keyup', onKeyUp)
    }
  }, [pressedKeys])

  const onMouseDown = async (note: string) => {
    if (Tone.context.state !== 'running') {
      await Tone.start()
    }

    if (synthRef.current && !pressedKeys.has(note)) {
      setPressedKeys((prev) => new Set(prev).add(note))
      synthRef.current.triggerAttack(note)
    }
  }

  const onMouseUp = (note: string) => {
    if (synthRef.current && pressedKeys.has(note)) {
      setPressedKeys((prev) => {
        const newSet = new Set(prev)
        newSet.delete(note)
        return newSet
      })
      synthRef.current.triggerRelease(note)
    }
  }

  return (
    <div className="flex justify-center items-center bg-gray-100 p-8">
      <div className="flex bg-white rounded-lg shadow-lg border border-gray-200 overflow-hidden">
        {pianoNotes.map((note, index) => {
          const isBlackKey = note.includes('#')
          const isPressed = pressedKeys.has(note)

          if (isBlackKey) {
            const whiteKeyIndex = pianoNotes.slice(0, index).filter((n) => !n.includes('#')).length
            return (
              <div
                key={note}
                className={`absolute w-6 h-24 rounded-b border border-gray-400 cursor-pointer z-10 shadow-md transition-all duration-75 ${isPressed ? 'bg-gray-700 translate-y-1' : 'bg-black'}`}
                style={{
                  left: `${whiteKeyIndex * 2.125 - 0.75}rem`,
                  marginLeft: '-0.75rem',
                }}
                onMouseDown={() => onMouseDown(note)}
                onMouseUp={() => onMouseUp(note)}
                onMouseLeave={() => onMouseUp(note)}
              />
            )
          } else {
            return (
              <div
                key={note}
                className={`w-8 h-40 border border-gray-400 cursor-pointer rounded-b shadow-md transition-all duration-75 ${isPressed ? 'bg-gray-200 translate-y-1' : 'bg-white hover:bg-gray-50'}`}
                onMouseDown={() => onMouseDown(note)}
                onMouseUp={() => onMouseUp(note)}
                onMouseLeave={() => onMouseUp(note)}
              />
            )
          }
        })}
      </div>
    </div>
  )
}

// 이펙터 모달 컴포넌트
const EffectModal: React.FC<{ effectsChain: ToneEffectsChain | null }> = ({ effectsChain }) => {
  const [isOpen, setIsOpen] = useState(true)
  const [effects, setEffects] = useState<Record<EffectType, EffectState>>(initialEffectsState)
  const [expandedEffect, setExpandedEffect] = useState<EffectType | null>(null)

  // 이펙터 상태 변경 시 오디오 이펙터 업데이트
  useEffect(() => {
    if (effectsChain) {
      Object.entries(effects).forEach(([effectType, state]) => {
        effectsChain.updateEffect(effectType as EffectType, state)
      })
    }
  }, [effects, effectsChain])

  // 이펙터 토글
  const toggleEffect = async (effectType: EffectType) => {
    if (Tone.context.state !== 'running') {
      await Tone.start()
    }

    setEffects((prev) => ({
      ...prev,
      [effectType]: {
        ...prev[effectType],
        enabled: !prev[effectType].enabled,
      },
    }))
  }

  // 이펙터 파라미터 변경
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

  // 패널 확장/축소
  const toggleExpand = (effectType: EffectType) => {
    setExpandedEffect(expandedEffect === effectType ? null : effectType)
  }

  // 이펙터 초기화
  const resetEffects = () => {
    setEffects(initialEffectsState)
  }

  return (
    <div
      className={`fixed right-4 top-4 w-60 h-96 bg-white rounded-lg shadow-xl border border-gray-200 p-4 overflow-y-auto z-20 transition-transform duration-300 ${
        isOpen ? 'translate-x-0' : 'translate-x-full'
      }`}
    >
      <button onClick={() => setIsOpen(!isOpen)} className="absolute -left-8 top-4 w-8 h-8 bg-white rounded-l-lg border border-gray-200 flex items-center justify-center shadow-md">
        <span className={`transform transition-transform ${isOpen ? 'rotate-180' : ''}`}>▶</span>
      </button>

      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold">이펙터</h2>
        <span className="text-sm">{Object.values(effects).some((effect) => effect.enabled) ? '🟢' : '🔴'}</span>
      </div>

      {/* 리버브 */}
      <div className="mb-3 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => toggleExpand('reverb')}>
          <span className="font-medium text-sm">리버브</span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleEffect('reverb')
              }}
              className={`w-8 h-4 rounded-full relative transition-colors ${effects.reverb.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${effects.reverb.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-xs">{expandedEffect === 'reverb' ? '▲' : '▼'}</span>
          </div>
        </div>
        {expandedEffect === 'reverb' && (
          <div className="px-3 pb-3 space-y-2">
            <div>
              <label className="text-xs text-gray-600">룸 크기: {effects.reverb.params.roomSize.toFixed(1)}</label>
              <input
                type="range"
                min={0.1}
                max={1}
                step={0.1}
                value={effects.reverb.params.roomSize}
                onChange={(e) => updateEffectParam('reverb', 'roomSize', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">감쇠: {effects.reverb.params.decay.toFixed(1)}</label>
              <input
                type="range"
                min={0.1}
                max={10}
                step={0.1}
                value={effects.reverb.params.decay}
                onChange={(e) => updateEffectParam('reverb', 'decay', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">믹스: {(effects.reverb.params.mix * 100).toFixed(0)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={effects.reverb.params.mix}
                onChange={(e) => updateEffectParam('reverb', 'mix', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* 딜레이 */}
      <div className="mb-3 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => toggleExpand('delay')}>
          <span className="font-medium text-sm">딜레이</span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleEffect('delay')
              }}
              className={`w-8 h-4 rounded-full relative transition-colors ${effects.delay.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${effects.delay.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-xs">{expandedEffect === 'delay' ? '▲' : '▼'}</span>
          </div>
        </div>
        {expandedEffect === 'delay' && (
          <div className="px-3 pb-3 space-y-2">
            <div>
              <label className="text-xs text-gray-600">타임: {effects.delay.params.time.toFixed(2)}s</label>
              <input
                type="range"
                min={0.05}
                max={1}
                step={0.01}
                value={effects.delay.params.time}
                onChange={(e) => updateEffectParam('delay', 'time', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">피드백: {(effects.delay.params.feedback * 100).toFixed(0)}%</label>
              <input
                type="range"
                min={0}
                max={0.9}
                step={0.01}
                value={effects.delay.params.feedback}
                onChange={(e) => updateEffectParam('delay', 'feedback', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">믹스: {(effects.delay.params.mix * 100).toFixed(0)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={effects.delay.params.mix}
                onChange={(e) => updateEffectParam('delay', 'mix', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* 디스토션 */}
      <div className="mb-3 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => toggleExpand('distortion')}>
          <span className="font-medium text-sm">디스토션</span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleEffect('distortion')
              }}
              className={`w-8 h-4 rounded-full relative transition-colors ${effects.distortion.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${effects.distortion.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-xs">{expandedEffect === 'distortion' ? '▲' : '▼'}</span>
          </div>
        </div>
        {expandedEffect === 'distortion' && (
          <div className="px-3 pb-3 space-y-2">
            <div>
              <label className="text-xs text-gray-600">게인: {(effects.distortion.params.gain * 100).toFixed(0)}%</label>
              <input
                type="range"
                min={0}
                max={1}
                step={0.01}
                value={effects.distortion.params.gain}
                onChange={(e) => updateEffectParam('distortion', 'gain', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      {/* EQ */}
      <div className="mb-3 bg-gray-50 rounded-lg border border-gray-200 overflow-hidden">
        <div className="flex items-center justify-between p-3 cursor-pointer" onClick={() => toggleExpand('eq')}>
          <span className="font-medium text-sm">이퀄라이저</span>
          <div className="flex items-center gap-2">
            <button
              onClick={(e) => {
                e.stopPropagation()
                toggleEffect('eq')
              }}
              className={`w-8 h-4 rounded-full relative transition-colors ${effects.eq.enabled ? 'bg-blue-500' : 'bg-gray-300'}`}
            >
              <div className={`w-3 h-3 bg-white rounded-full absolute top-0.5 transition-transform ${effects.eq.enabled ? 'translate-x-4' : 'translate-x-0.5'}`} />
            </button>
            <span className="text-xs">{expandedEffect === 'eq' ? '▲' : '▼'}</span>
          </div>
        </div>
        {expandedEffect === 'eq' && (
          <div className="px-3 pb-3 space-y-2">
            <div>
              <label className="text-xs text-gray-600">
                저음: {effects.eq.params.low > 0 ? '+' : ''}
                {effects.eq.params.low}dB
              </label>
              <input
                type="range"
                min={-12}
                max={12}
                step={1}
                value={effects.eq.params.low}
                onChange={(e) => updateEffectParam('eq', 'low', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">
                중음: {effects.eq.params.mid > 0 ? '+' : ''}
                {effects.eq.params.mid}dB
              </label>
              <input
                type="range"
                min={-12}
                max={12}
                step={1}
                value={effects.eq.params.mid}
                onChange={(e) => updateEffectParam('eq', 'mid', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
            <div>
              <label className="text-xs text-gray-600">
                고음: {effects.eq.params.high > 0 ? '+' : ''}
                {effects.eq.params.high}dB
              </label>
              <input
                type="range"
                min={-12}
                max={12}
                step={1}
                value={effects.eq.params.high}
                onChange={(e) => updateEffectParam('eq', 'high', parseFloat(e.target.value))}
                className="w-full h-1 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
            </div>
          </div>
        )}
      </div>

      <button onClick={resetEffects} className="w-full mt-4 py-2 bg-gray-200 hover:bg-gray-300 text-gray-700 rounded-lg text-sm transition-colors">
        이펙터 초기화
      </button>
    </div>
  )
}

// 메인 앱 컴포넌트
const PianoEffectsApp: React.FC = () => {
  const [effectsChain, setEffectsChain] = useState<ToneEffectsChain | null>(null)

  useEffect(() => {
    const chain = new ToneEffectsChain()
    setEffectsChain(chain)

    return () => {
      chain.dispose()
    }
  }, [])

  return (
    <div className="min-h-screen bg-gray-100 relative">
      <div className="pt-20">
        <h1 className="text-center text-3xl font-bold text-gray-800 mb-8">Piano with Effects</h1>
        <div className="text-center text-gray-600 mb-8">
          <p>키보드로 연주하기: A S D F G H J K (화이트키), W E T Y U (블랙키)</p>
          <p>마우스로도 연주할 수 있습니다!</p>
        </div>
        <PianoComponent effectsChain={effectsChain} />
      </div>
      <EffectModal effectsChain={effectsChain} />
    </div>
  )
}

export default PianoEffectsApp
