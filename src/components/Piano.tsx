import styled from 'styled-components'
import { useEffect, useRef, useState } from 'react'
import { Piano } from '@tonejs/piano/build/piano/Piano'
import { BarLoader } from 'react-spinners'
import { theme } from '../styles/Theme'
import { useEffects } from '../contexts/effectsContext'
import * as Tone from 'tone'

const pianoNotes: string[] = [
  'C2',
  'C#2',
  'D2',
  'D#2',
  'E2',
  'F2',
  'F#2',
  'G2',
  'G#2',
  'A2',
  'A#2',
  'B2',
  'C3',
  'C#3',
  'D3',
  'D#3',
  'E3',
  'F3',
  'F#3',
  'G3',
  'G#3',
  'A3',
  'A#3',
  'B3',
  'C4',
  'C#4',
  'D4',
  'D#4',
  'E4',
  'F4',
  'F#4',
  'G4',
  'G#4',
  'A4',
  'A#4',
  'B4',
  'C5',
  'C#5',
  'D5',
  'D#5',
  'E5',
  'F5',
  'F#5',
  'G5',
  'G#5',
  'A5',
  'A#5',
  'B5',
  'C6',
  'C#6',
  'D6',
  'D#6',
  'E6',
  'F6',
  'F#6',
  'G6',
  'G#6',
  'A6',
  'A#6',
  'B6',
]

export const PianoComponents = () => {
  const pianoRef = useRef<Piano | null>(null)
  const [loaded, setLoaded] = useState(false)
  const [pressedKeys, setPressedKeys] = useState<Set<string>>(new Set())
  const { getEffectChain } = useEffects()

  // useEffect(() => {
  //   if (!pianoRef.current) {
  //     const piano = new Piano({ velocities: 1 })
  //     piano.load().then(() => setLoaded(true))

  //     // 🎯 여기가 핵심! Native AudioNode → Tone으로 연결
  //     const pianoOutput = piano.output as unknown as AudioNode
  //     pianoOutput.disconnect() // 혹시 연결되어 있다면 끊고
  //     pianoOutput.connect(getEffectChain() as unknown as AudioNode)

  //     pianoRef.current = piano
  //   }
  // }, [getEffectChain])

  useEffect(() => {
    const initializePiano = async () => {
      try {
        // Tone.js 컨텍스트 시작
        if (Tone.context.state !== 'running') {
          await Tone.start()
        }

        if (!pianoRef.current) {
          const piano = new Piano({
            velocities: 1,
            // 피아노 사운드 로드할 때 기본 연결 비활성화
            // volume: -10, // 볼륨을 낮춰서 테스트
          })

          await piano.load()

          // 피아노 출력을 이펙트 체인에 연결
          const effectChain = getEffectChain()

          // 기존 연결 해제
          piano.disconnect()

          // 이펙트 체인에 연결
          piano.connect(effectChain)

          pianoRef.current = piano
          setLoaded(true)

          console.log('Piano initialized with effects chain')
        }
      } catch (error) {
        console.error('Piano initialization error:', error)
      }
    }

    initializePiano()
  }, [getEffectChain])

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
    if (Tone.context.state !== 'running') {
      await Tone.start()
    }
    const note = noteMap[e.code]
    if (note && !pressedKeys.has(note) && pianoRef.current) {
      setPressedKeys((prev) => new Set(prev).add(note))
      pianoRef.current?.keyDown({ note })
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    const note = noteMap[e.code]
    if (note && pressedKeys.has(note) && pianoRef.current) {
      setPressedKeys((prev) => {
        const newSet = new Set(prev)
        newSet.delete(note)
        return newSet
      })
      pianoRef.current?.keyUp({ note })
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
    // 사용자 상호작용으로 Tone.js 컨텍스트 시작
    if (Tone.context.state !== 'running') {
      await Tone.start()
    }

    if (loaded && pianoRef.current && !pressedKeys.has(note)) {
      setPressedKeys((prev) => new Set(prev).add(note))
      pianoRef.current.keyDown({ note })
    }
  }

  const onMouseUp = (note: string) => {
    if (loaded && pianoRef.current && pressedKeys.has(note)) {
      setPressedKeys((prev) => {
        const newSet = new Set(prev)
        newSet.delete(note)
        return newSet
      })
      pianoRef.current.keyUp({ note })
    }
  }

  const isKeyPressed = (note: string) => pressedKeys.has(note)

  return (
    <Container>
      <Content>
        {loaded ? (
          pianoNotes.map((note, index) => {
            const isBlackKey = note.includes('#')
            const isPressed = isKeyPressed(note)
            const whiteKeyIndex = index - pianoNotes.slice(0, index).filter((n) => n.includes('#')).length

            return isBlackKey ? (
              <BlackKey
                key={note}
                $isPressed={isPressed}
                $leftPosition={whiteKeyIndex * 34 + 22}
                onMouseDown={() => onMouseDown(note)}
                onMouseUp={() => onMouseUp(note)}
                onMouseLeave={() => onMouseUp(note)}
              />
            ) : (
              <WhiteKey key={note} $isPressed={isPressed} onMouseDown={() => onMouseDown(note)} onMouseUp={() => onMouseUp(note)} onMouseLeave={() => onMouseUp(note)} />
            )
          })
        ) : (
          <BarLoader color={theme.color.orange400} />
        )}
      </Content>
    </Container>
  )
}

const BlackKey = styled.button<{ $isPressed: boolean; $leftPosition: number }>`
  background-color: ${({ $isPressed }) => ($isPressed ? '#333' : '#000')};
  width: 22px;
  height: 102px;
  border: 1px solid ${({ theme }) => theme.color.gray400};
  border-radius: 0px 0px 4px 4px;
  box-shadow: 0px 5px 2px 0px rgba(0, 0, 0, 0.25);
  position: absolute;
  margin-left: -12px;
  z-index: 2;
  transform: ${({ $isPressed }) => ($isPressed ? 'translateY(2px)' : 'translateY(0)')};
  &:active {
    margin-top: 4px;
  }
`

const WhiteKey = styled.button<{ $isPressed: boolean }>`
  background-color: ${({ $isPressed, theme }) => ($isPressed ? theme.color.gray200 : '#fff')};
  width: 34px;
  height: 180px;
  border: 1px solid ${({ theme }) => theme.color.gray400};
  border-radius: 0px 0px 4px 4px;
  box-shadow: 0px 5px 2px 0px rgba(0, 0, 0, 0.25);
  transform: ${({ $isPressed }) => ($isPressed ? 'translateY(2px)' : 'translateY(0)')};

  &:active {
    background-color: ${({ theme }) => theme.color.gray200};
  }
  &:disabled {
    background-color: #ddd;
  }
`

const Content = styled.div`
  width: fit-content;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  border-radius: 16px;
  margin: auto;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 70dvh;
  background-color: ${({ theme }) => theme.color.gray50};
`
