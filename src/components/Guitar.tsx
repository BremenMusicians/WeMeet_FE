import { useEffect } from 'react'
import styled from 'styled-components'
import * as Tone from 'tone'

function GuitarComponents() {
  const guitarFrets = [2, 2.4, 3, 3.6, 4.2, 5]
  const inlayPositions = [2, 4, 6, 8, 11]
  const doubleInlayPositions = [11]
  const newSynth = new Tone.PolySynth(Tone.Synth).toDestination()
  newSynth.set({
    oscillator: {
      type: 'fmsine',
    },
    envelope: {
      attack: 0.01,
      decay: 0.2,
      sustain: 0.5,
      release: 1.5,
    },
  })
  const synth: Tone.PolySynth<Tone.Synth<Tone.SynthOptions>> | null = newSynth

  const openStringNotes = ['E4', 'B3', 'G3', 'D3', 'A2', 'E2']
  const keyBindings = ['!@#$%^&*()_+', 'QWERTYUIOP[]|', '1234567890-=', 'qwertyuiop[]]\\', "asdfghjkl;'", 'zxcvbnm,./']

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keyBindings.map((keys, stringIndex) => {
        const fretIndex = keys.indexOf(e.key)
        if (fretIndex !== -1) {
          playString(stringIndex, fretIndex)
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const getNoteFromFret = (stringIndex: number, fretIndex: number) => {
    const baseNote = openStringNotes[stringIndex]
    if (fretIndex === 0) return baseNote
    return Tone.Frequency(baseNote).transpose(fretIndex).toNote()
  }

  const playString = (stringIndex: number, fretIndex: number) => {
    if (synth) {
      const note = getNoteFromFret(stringIndex, fretIndex)
      synth?.triggerAttackRelease(note, '8n')
    }
  }

  return (
    <Container>
      <Fretboard>
        {guitarFrets.map((h, lineIndex) => (
          <FretBox key={`string-${lineIndex}`}>
            <GuitarString height={h} />
            {Array.from({ length: 13 }).map((_, fretIndex) => (
              <Fret key={`fret-${lineIndex}-${fretIndex}`} onClick={() => playString(lineIndex, fretIndex)}>
                {lineIndex === 2 && inlayPositions.includes(fretIndex) && <InlayDot double={doubleInlayPositions.includes(fretIndex)} />}
              </Fret>
            ))}
          </FretBox>
        ))}
      </Fretboard>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  height: 70dvh;
`

const FretBox = styled.div`
  width: 860px;
  display: flex;
  position: relative;
`

const Fret = styled.div`
  width: 64px;
  height: 35px;
  border-right: 1px solid ${({ theme }) => theme.color.gray700};
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.color.gray200};
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`

const Fretboard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.gray100};
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.gray200};
`

const GuitarString = styled.span<{ height: number; isActive?: boolean }>`
  height: ${({ height }) => height}px;
  background-color: ${({ theme }) => theme.color.gray300};
  stroke: ${({ theme }) => theme.color.gray300};
  background-image: repeating-linear-gradient(50deg, rgba(0, 0, 0, 0.6), transparent 0.15em, transparent 0.2em),
    linear-gradient(180deg, rgba(0, 0, 0, 0.3) 10%, hsla(0, 0%, 100%, 0.25) 15%, hsla(0, 0%, 100%, 0.8) 30%, hsla(0, 0%, 100%, 0.25) 45%, rgba(0, 0, 0, 0.6) 90%);
  transform-origin: center;
  z-index: 10;
  position: absolute;
  align-self: center;
  width: 100%;
  box-shadow: 10px 5px 2px rgba(0, 0, 0, 0.1);
`

const InlayDot = styled.div<{ double?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.gray500};
  position: absolute;
  z-index: 5;
  top: ${({ double }) => (double ? -41 : 29)}px;

  ${(props) =>
    props.double &&
    `
    &:before {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: ${props.theme.color.gray600};
      top: 140px;
    }
  `}
`

export default GuitarComponents
