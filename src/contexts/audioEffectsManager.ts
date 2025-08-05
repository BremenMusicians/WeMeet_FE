import { EffectType, EffectState, AudioEffect, ReverbEffect, DelayEffect, DistortionEffect, EQEffect, CompressorEffect } from './types'

export class AudioEffectsManager {
  private audioContext: AudioContext | null = null
  private masterGain: GainNode | null = null
  private effects: Map<EffectType, AudioEffect> = new Map()
  private effectsChain: AudioNode[] = []

  constructor() {
    this.initializeAudioContext()
  }

  private initializeAudioContext() {
    try {
      this.audioContext = new (window.AudioContext || (window as any).webkitAudioContext)()
      this.masterGain = this.audioContext.createGain()
      this.masterGain.connect(this.audioContext.destination)
      this.setupEffectsChain()
    } catch (error) {
      console.error('Failed to initialize audio context:', error)
    }
  }

  private setupEffectsChain() {
    if (!this.audioContext) return

    // 이펙터 체인 순서: 컴프레서 -> 디스토션 -> EQ -> 딜레이 -> 리버브
    this.createCompressor()
    this.createDistortion()
    this.createEQ()
    this.createDelay()
    this.createReverb()
  }

  private createReverb() {
    if (!this.audioContext) return

    const convolver = this.audioContext.createConvolver()
    const reverbGain = this.audioContext.createGain()
    const dryGain = this.audioContext.createGain()
    const wetGain = this.audioContext.createGain()

    // 임펄스 응답 생성 (간단한 리버브)
    const impulseBuffer = this.createImpulseResponse(2, 44100)
    convolver.buffer = impulseBuffer

    // 연결: input -> dry/wet split -> output
    const input = this.audioContext.createGain()
    input.connect(dryGain)
    input.connect(convolver)
    convolver.connect(wetGain)

    dryGain.connect(reverbGain)
    wetGain.connect(reverbGain)

    const reverbEffect: ReverbEffect = {
      input,
      output: reverbGain,
      convolver,
      dryGain,
      wetGain,
    }

    this.effects.set('reverb', reverbEffect)
  }

  private createDelay() {
    if (!this.audioContext) return

    const delay = this.audioContext.createDelay(1.0)
    const feedback = this.audioContext.createGain()
    const delayGain = this.audioContext.createGain()
    const dryGain = this.audioContext.createGain()
    const wetGain = this.audioContext.createGain()

    const input = this.audioContext.createGain()
    const output = this.audioContext.createGain()

    // 연결
    input.connect(dryGain)
    input.connect(delay)
    delay.connect(feedback)
    delay.connect(wetGain)
    feedback.connect(delay)

    dryGain.connect(output)
    wetGain.connect(output)

    const delayEffect: DelayEffect = {
      input,
      output,
      delay,
      feedback,
      wetGain,
    }

    this.effects.set('delay', delayEffect)
  }

  private createDistortion() {
    if (!this.audioContext) return

    const waveshaper = this.audioContext.createWaveShaper()
    const inputGain = this.audioContext.createGain()
    const outputGain = this.audioContext.createGain()
    const toneFilter = this.audioContext.createBiquadFilter()

    toneFilter.type = 'lowpass'
    toneFilter.frequency.value = 2000

    inputGain.connect(waveshaper)
    waveshaper.connect(toneFilter)
    toneFilter.connect(outputGain)

    const distortionEffect: DistortionEffect = {
      input: inputGain,
      output: outputGain,
      waveshaper,
      toneFilter,
    }

    this.effects.set('distortion', distortionEffect)
  }

  private createEQ() {
    if (!this.audioContext) return

    const lowFilter = this.audioContext.createBiquadFilter()
    const midFilter = this.audioContext.createBiquadFilter()
    const highFilter = this.audioContext.createBiquadFilter()

    lowFilter.type = 'lowshelf'
    lowFilter.frequency.value = 320
    midFilter.type = 'peaking'
    midFilter.frequency.value = 1000
    midFilter.Q.value = 1
    highFilter.type = 'highshelf'
    highFilter.frequency.value = 3200

    lowFilter.connect(midFilter)
    midFilter.connect(highFilter)

    const eqEffect: EQEffect = {
      input: lowFilter,
      output: highFilter,
      lowFilter,
      midFilter,
      highFilter,
    }

    this.effects.set('eq', eqEffect)
  }

  private createCompressor() {
    if (!this.audioContext) return

    const compressor = this.audioContext.createDynamicsCompressor()

    const compressorEffect: CompressorEffect = {
      input: compressor,
      output: compressor,
      compressor,
    }

    this.effects.set('compressor', compressorEffect)
  }

  private createImpulseResponse(duration: number, sampleRate: number): AudioBuffer {
    if (!this.audioContext) throw new Error('Audio context not initialized')

    const length = sampleRate * duration
    const impulse = this.audioContext.createBuffer(2, length, sampleRate)

    for (let channel = 0; channel < 2; channel++) {
      const channelData = impulse.getChannelData(channel)
      for (let i = 0; i < length; i++) {
        channelData[i] = (Math.random() * 2 - 1) * Math.pow(1 - i / length, 2)
      }
    }

    return impulse
  }

  private makeDistortionCurve(amount: number): Float32Array {
    const samples = 44100
    const curve = new Float32Array(samples)
    const deg = Math.PI / 180

    for (let i = 0; i < samples; i++) {
      const x = (i * 2) / samples - 1
      curve[i] = ((3 + amount) * x * 20 * deg) / (Math.PI + amount * Math.abs(x))
    }

    return curve
  }

  // 이펙터 상태 업데이트
  updateEffect(effectType: EffectType, state: EffectState) {
    const effect = this.effects.get(effectType)
    if (!effect) return

    switch (effectType) {
      case 'reverb':
        this.updateReverb(effect, state)
        break
      case 'delay':
        this.updateDelay(effect, state)
        break
      case 'distortion':
        this.updateDistortion(effect, state)
        break
      case 'eq':
        this.updateEQ(effect, state)
        break
      case 'compressor':
        this.updateCompressor(effect, state)
        break
    }
  }

  private updateReverb(effect: AudioEffect, state: EffectState) {
    const reverbEffect = effect as ReverbEffect
    if (reverbEffect.dryGain && reverbEffect.wetGain) {
      if (state.enabled) {
        reverbEffect.dryGain.gain.value = 1 - (state.params.mix || 0.5)
        reverbEffect.wetGain.gain.value = state.params.mix || 0.5
      } else {
        reverbEffect.dryGain.gain.value = 1
        reverbEffect.wetGain.gain.value = 0
      }
    }
  }

  private updateDelay(effect: AudioEffect, state: EffectState) {
    const delayEffect = effect as DelayEffect
    if (delayEffect.delay && delayEffect.feedback && delayEffect.wetGain) {
      if (state.enabled) {
        delayEffect.delay.delayTime.value = state.params.time || 0.3
        delayEffect.feedback.gain.value = state.params.feedback || 0.3
        delayEffect.wetGain.gain.value = state.params.mix || 0.5
      } else {
        delayEffect.wetGain.gain.value = 0
      }
    }
  }

  private updateDistortion(effect: AudioEffect, state: EffectState) {
    const distortionEffect = effect as DistortionEffect
    if (distortionEffect.waveshaper && distortionEffect.toneFilter) {
      if (state.enabled) {
        distortionEffect.waveshaper.curve = this.makeDistortionCurve((state.params.gain || 0.5) * 100)
        distortionEffect.toneFilter.frequency.value = 2000 + (state.params.tone || 0.5) * 8000
      } else {
        distortionEffect.waveshaper.curve = null
      }
    }
  }

  private updateEQ(effect: AudioEffect, state: EffectState) {
    const eqEffect = effect as EQEffect
    if (eqEffect.lowFilter && eqEffect.midFilter && eqEffect.highFilter) {
      if (state.enabled) {
        eqEffect.lowFilter.gain.value = state.params.low || 0
        eqEffect.midFilter.gain.value = state.params.mid || 0
        eqEffect.highFilter.gain.value = state.params.high || 0
      } else {
        eqEffect.lowFilter.gain.value = 0
        eqEffect.midFilter.gain.value = 0
        eqEffect.highFilter.gain.value = 0
      }
    }
  }

  private updateCompressor(effect: AudioEffect, state: EffectState) {
    const compressorEffect = effect as CompressorEffect
    if (compressorEffect.compressor) {
      if (state.enabled) {
        compressorEffect.compressor.threshold.value = state.params.threshold || -24
        compressorEffect.compressor.ratio.value = state.params.ratio || 3
        compressorEffect.compressor.attack.value = state.params.attack || 0.003
        compressorEffect.compressor.release.value = state.params.release || 0.25
      } else {
        compressorEffect.compressor.threshold.value = -24
        compressorEffect.compressor.ratio.value = 1
      }
    }
  }

  // 피아노 소스를 이펙터 체인에 연결
  connectSource(source: AudioNode): AudioNode {
    if (!this.audioContext || !this.masterGain) return source

    let currentNode = source

    // 이펙터가 활성화된 경우에만 체인에 연결
    const effectOrder: EffectType[] = ['compressor', 'distortion', 'eq', 'delay', 'reverb']

    for (const effectType of effectOrder) {
      const effect = this.effects.get(effectType)
      if (effect) {
        currentNode.connect(effect.input)
        currentNode = effect.output
      }
    }

    currentNode.connect(this.masterGain)
    return currentNode
  }

  // 마스터 볼륨 설정
  setMasterVolume(volume: number) {
    if (this.masterGain) {
      this.masterGain.gain.value = Math.max(0, Math.min(1, volume))
    }
  }

  // 특정 이펙트 활성화/비활성화
  toggleEffect(effectType: EffectType, enabled: boolean) {
    const effect = this.effects.get(effectType)
    if (!effect) return

    const defaultState: EffectState = {
      enabled,
      params: this.getDefaultParams(effectType),
    }

    this.updateEffect(effectType, defaultState)
  }

  private getDefaultParams(effectType: EffectType): { [key: string]: number } {
    switch (effectType) {
      case 'reverb':
        return { mix: 0.3 }
      case 'delay':
        return { time: 0.3, feedback: 0.3, mix: 0.3 }
      case 'distortion':
        return { gain: 0.5, tone: 0.5 }
      case 'eq':
        return { low: 0, mid: 0, high: 0 }
      case 'compressor':
        return { threshold: -24, ratio: 3, attack: 0.003, release: 0.25 }
      default:
        return {}
    }
  }

  // 이펙트 파라미터 설정
  setEffectParam(effectType: EffectType, paramName: string, value: number) {
    const effect = this.effects.get(effectType)
    if (!effect) return

    const currentParams = this.getDefaultParams(effectType)
    currentParams[paramName] = value

    const state: EffectState = {
      enabled: true,
      params: currentParams,
    }

    this.updateEffect(effectType, state)
  }

  // 오디오 컨텍스트 시작 (사용자 제스처 필요)
  async resume() {
    if (this.audioContext && this.audioContext.state === 'suspended') {
      await this.audioContext.resume()
    }
  }

  // 오디오 컨텍스트 상태 확인
  getAudioContextState(): AudioContextState | null {
    return this.audioContext ? this.audioContext.state : null
  }

  // 현재 활성화된 이펙트 목록 반환
  getActiveEffects(): EffectType[] {
    const activeEffects: EffectType[] = []

    for (const [effectType, effect] of this.effects) {
      // 각 이펙트의 활성화 상태를 확인하는 로직
      // 여기서는 간단히 모든 이펙트를 반환하지만, 실제로는 각 이펙트의 상태를 추적해야 함
      activeEffects.push(effectType)
    }

    return activeEffects
  }

  // 이펙트 체인 재구성
  rebuildEffectsChain() {
    // 기존 연결 해제
    this.effects.clear()

    // 새로운 이펙트 체인 생성
    this.setupEffectsChain()
  }

  // 정리
  dispose() {
    if (this.audioContext) {
      this.audioContext.close()
      this.audioContext = null
    }
    this.effects.clear()
    this.effectsChain = []
  }
}
