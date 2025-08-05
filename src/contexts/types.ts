// types.ts

// 이펙터 타입 정의
export type EffectType = 'reverb' | 'delay' | 'distortion' | 'eq' | 'compressor'

export interface EffectState {
  enabled: boolean
  params: {
    [key: string]: number
  }
}

export interface AudioEffect {
  input: AudioNode
  output: AudioNode
  [key: string]: any
}

export interface ReverbEffect extends AudioEffect {
  convolver: ConvolverNode
  dryGain: GainNode
  wetGain: GainNode
}

export interface DelayEffect extends AudioEffect {
  delay: DelayNode
  feedback: GainNode
  wetGain: GainNode
}

export interface DistortionEffect extends AudioEffect {
  waveshaper: WaveShaperNode
  toneFilter: BiquadFilterNode
}

export interface EQEffect extends AudioEffect {
  lowFilter: BiquadFilterNode
  midFilter: BiquadFilterNode
  highFilter: BiquadFilterNode
}

export interface CompressorEffect extends AudioEffect {
  compressor: DynamicsCompressorNode
}

// 이펙터 상태 인터페이스
export interface EffectState {
  enabled: boolean
  params: {
    [key: string]: number
  }
}

// 각 이펙터별 구체적인 파라미터 인터페이스
export interface ReverbParams {
  decay: number // 감쇠 시간 (0.1 - 10초)
  mix: number // 믹스 비율 (0 - 1)
}

export interface DelayParams {
  time: number // 딜레이 시간 (0.05 - 1초)
  feedback: number // 피드백 양 (0 - 0.9)
  mix: number // 믹스 비율 (0 - 1)
}

export interface DistortionParams {
  gain: number // 게인 (0 - 1)
  tone: number // 톤 (0 - 1)
}

export interface EQParams {
  low: number // 저음 (-12 - +12 dB)
  mid: number // 중음 (-12 - +12 dB)
  high: number // 고음 (-12 - +12 dB)
}

export interface CompressorParams {
  threshold: number // 쓰레숄드 (-60 - 0 dB)
  ratio: number // 비율 (1 - 20:1)
  attack: number // 어택 (0.001 - 0.1초)
  release: number // 릴리즈 (0.05 - 1초)
}

// 이펙터 상태 타입 (구체적인 파라미터 타입 포함)
export interface TypedEffectState<T = any> {
  enabled: boolean
  params: T
}

// 전체 이펙터 상태 타입
export interface EffectsState {
  reverb: TypedEffectState<ReverbParams>
  delay: TypedEffectState<DelayParams>
  distortion: TypedEffectState<DistortionParams>
  eq: TypedEffectState<EQParams>
  compressor: TypedEffectState<CompressorParams>
}

// 이펙터 초기값 상수
export const EFFECT_DEFAULTS: EffectsState = {
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

// 이펙터 파라미터 범위 정의
export const EFFECT_RANGES = {
  reverb: {
    decay: { min: 0.1, max: 10, step: 0.1 },
    mix: { min: 0, max: 1, step: 0.01 },
  },
  delay: {
    time: { min: 0.05, max: 1, step: 0.01 },
    feedback: { min: 0, max: 0.9, step: 0.01 },
    mix: { min: 0, max: 1, step: 0.01 },
  },
  distortion: {
    gain: { min: 0, max: 1, step: 0.01 },
    tone: { min: 0, max: 1, step: 0.01 },
  },
  eq: {
    low: { min: -12, max: 12, step: 1 },
    mid: { min: -12, max: 12, step: 1 },
    high: { min: -12, max: 12, step: 1 },
  },
  compressor: {
    threshold: { min: -60, max: 0, step: 1 },
    ratio: { min: 1, max: 20, step: 0.5 },
    attack: { min: 0.001, max: 0.1, step: 0.001 },
    release: { min: 0.05, max: 1, step: 0.01 },
  },
} as const

// 이펙터 이름 표시용 맵핑
export const EFFECT_NAMES: Record<EffectType, string> = {
  reverb: '리버브',
  delay: '딜레이',
  distortion: '디스토션',
  eq: '이퀄라이저',
  compressor: '컴프레서',
}

// 이펙터 파라미터 이름 표시용 맵핑
export const PARAM_NAMES = {
  reverb: {
    decay: '감쇠',
    mix: '믹스',
  },
  delay: {
    time: '타임',
    feedback: '피드백',
    mix: '믹스',
  },
  distortion: {
    gain: '게인',
    tone: '톤',
  },
  eq: {
    low: '저음',
    mid: '중음',
    high: '고음',
  },
  compressor: {
    threshold: '쓰레숄드',
    ratio: '비율',
    attack: '어택',
    release: '릴리즈',
  },
} as const

// 파라미터 값 포맷팅 함수
export const formatParamValue = (effectType: EffectType, paramName: string, value: number): string => {
  switch (effectType) {
    case 'reverb':
      if (paramName === 'decay') return `${value.toFixed(1)}s`
      if (paramName === 'mix') return `${(value * 100).toFixed(0)}%`
      break
    case 'delay':
      if (paramName === 'time') return `${value.toFixed(2)}s`
      if (paramName === 'feedback') return `${(value * 100).toFixed(0)}%`
      if (paramName === 'mix') return `${(value * 100).toFixed(0)}%`
      break
    case 'distortion':
      if (paramName === 'gain') return `${(value * 100).toFixed(0)}%`
      if (paramName === 'tone') return `${(value * 100).toFixed(0)}%`
      break
    case 'eq':
      return `${value > 0 ? '+' : ''}${value}dB`
    case 'compressor':
      if (paramName === 'threshold') return `${value}dB`
      if (paramName === 'ratio') return `${value}:1`
      if (paramName === 'attack') return `${value * 1000}ms`
      if (paramName === 'release') return `${value * 1000}ms`
      break
  }
  return value.toString()
}
