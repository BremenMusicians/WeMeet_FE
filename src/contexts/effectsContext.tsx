import type React from 'react'
import { createContext, useContext, useState, useEffect, useRef } from 'react'
import * as Tone from 'tone'

type EffectType = 'reverb' | 'delay' | 'distortion' | 'eq' | 'compressor'

interface EffectState {
  enabled: boolean
  params: {
    [key: string]: number
  }
}

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

interface EffectsContextType {
  effects: Record<EffectType, EffectState>
  toggleEffect: (effectType: EffectType) => void
  updateEffectParam: (effectType: EffectType, paramName: string, value: number) => void
  resetEffects: () => void
  getEffectChain: () => Tone.ToneAudioNode
}

const EffectsContext = createContext<EffectsContextType | undefined>(undefined)

export const EffectsProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [effects, setEffects] = useState<Record<EffectType, EffectState>>(initialEffectsState)

  // Tone.js 이펙터 인스턴스들
  const reverbRef = useRef<Tone.Reverb | null>(null)
  const delayRef = useRef<Tone.FeedbackDelay | null>(null)
  const distortionRef = useRef<Tone.Distortion | null>(null)
  const eqRef = useRef<Tone.EQ3 | null>(null)
  const compressorRef = useRef<Tone.Compressor | null>(null)
  const inputRef = useRef<Tone.Gain | null>(null)
  const outputRef = useRef<Tone.Gain | null>(null)

  // 이펙터 초기화
  useEffect(() => {
    // 입력과 출력 게인 노드 생성
    inputRef.current = new Tone.Gain(1)
    outputRef.current = new Tone.Gain(1)

    // 이펙터 인스턴스 생성
    compressorRef.current = new Tone.Compressor({
      threshold: effects.compressor.params.threshold,
      ratio: effects.compressor.params.ratio,
      attack: effects.compressor.params.attack,
      release: effects.compressor.params.release,
    })

    eqRef.current = new Tone.EQ3({
      low: effects.eq.params.low,
      mid: effects.eq.params.mid,
      high: effects.eq.params.high,
    })

    distortionRef.current = new Tone.Distortion({
      distortion: effects.distortion.params.gain,
      wet: 0, // 초기에는 비활성화
    })

    delayRef.current = new Tone.FeedbackDelay({
      delayTime: effects.delay.params.time,
      feedback: effects.delay.params.feedback,
      wet: 0, // 초기에는 비활성화
    })

    reverbRef.current = new Tone.Reverb({
      decay: effects.reverb.params.decay,
      wet: 0, // 초기에는 비활성화
    })

    // 이펙터 체인 구성
    inputRef.current.chain(compressorRef.current, eqRef.current, distortionRef.current, delayRef.current, reverbRef.current, outputRef.current, Tone.Destination)

    return () => {
      // 정리
      reverbRef.current?.dispose()
      delayRef.current?.dispose()
      distortionRef.current?.dispose()
      eqRef.current?.dispose()
      compressorRef.current?.dispose()
      outputRef.current?.dispose()
      inputRef.current?.dispose()
    }
  }, [])

  // 이펙터 파라미터 업데이트
  useEffect(() => {
    if (reverbRef.current) {
      reverbRef.current.decay = effects.reverb.params.decay
      reverbRef.current.wet.value = effects.reverb.enabled ? effects.reverb.params.mix : 0
    }

    if (delayRef.current) {
      delayRef.current.delayTime.value = effects.delay.params.time
      delayRef.current.feedback.value = effects.delay.params.feedback
      delayRef.current.wet.value = effects.delay.enabled ? effects.delay.params.mix : 0
    }

    if (distortionRef.current) {
      distortionRef.current.distortion = effects.distortion.params.gain
      distortionRef.current.wet.value = effects.distortion.enabled ? 1 : 0
    }

    if (eqRef.current) {
      eqRef.current.low.value = effects.eq.enabled ? effects.eq.params.low : 0
      eqRef.current.mid.value = effects.eq.enabled ? effects.eq.params.mid : 0
      eqRef.current.high.value = effects.eq.enabled ? effects.eq.params.high : 0
    }

    if (compressorRef.current) {
      if (effects.compressor.enabled) {
        compressorRef.current.threshold.value = effects.compressor.params.threshold
        compressorRef.current.ratio.value = effects.compressor.params.ratio
        compressorRef.current.attack.value = effects.compressor.params.attack
        compressorRef.current.release.value = effects.compressor.params.release
      } else {
        // 컴프레서 비활성화 시 임계값을 매우 높게 설정
        compressorRef.current.threshold.value = 0
        compressorRef.current.ratio.value = 1
      }
    }
  }, [effects])

  const toggleEffect = (effectType: EffectType) => {
    setEffects((prev) => ({
      ...prev,
      [effectType]: {
        ...prev[effectType],
        enabled: !prev[effectType].enabled,
      },
    }))
  }

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

  const resetEffects = () => {
    setEffects(initialEffectsState)
  }

  const getEffectChain = () => inputRef.current ?? new Tone.Gain()

  return (
    <EffectsContext.Provider
      value={{
        effects,
        toggleEffect,
        updateEffectParam,
        resetEffects,
        getEffectChain,
      }}
    >
      {children}
    </EffectsContext.Provider>
  )
}

export const useEffects = () => {
  const context = useContext(EffectsContext)
  if (context === undefined) {
    throw new Error('useEffects must be used within an EffectsProvider')
  }
  return context
}
