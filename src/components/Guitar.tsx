import { useEffect } from 'react'
import styled from 'styled-components'

const f = Array.from({ length: 14 }, (_, i) => `f${i + 1}`)
const h = Array.from({ length: 5 }, (_, i) => `h${i + 1}`)
const g = Array.from({ length: 4 }, (_, i) => `g${i + 1}`)
const d = Array.from({ length: 5 }, (_, i) => `d${i + 1}`)
const a = Array.from({ length: 5 }, (_, i) => `a${i + 1}`)
const e = Array.from({ length: 5 }, (_, i) => `e${i + 1}`)

const STRINGS = [
  { h: 2, frets: f },
  { h: 2.4, frets: [...h, ...f].slice(0, 14) },
  { h: 3, frets: [...g, ...h, ...f].slice(0, 14) },
  { h: 3.6, frets: [...d, ...g, ...h].slice(0, 14) },
  { h: 4.2, frets: [...a, ...d, ...g] },
  { h: 5, frets: [...e, ...a, ...d].slice(0, 14) },
]
const SOUND_URL = import.meta.env.VITE_GUITAR_SOUND_URL

function GuitarComponents() {
  const inlayPositions = [2, 4, 6, 8, 11]
  const doubleInlayPositions = [11]

  const keyBindings = ['!@#$%^&*()_+', 'QWERTYUIOP[]|', '1234567890-=', 'qwertyuiop[]]\\', "asdfghjkl;'", 'zxcvbnm,./']

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      keyBindings.forEach((keys, stringIndex) => {
        const fretIndex = keys.indexOf(e.key)
        if (fretIndex !== -1) {
          play(STRINGS[stringIndex].frets[fretIndex])
        }
      })
    }

    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  const play = (sound: string) => {
    const audio = new Audio(`${SOUND_URL}/${sound}.mp3`)
    audio.play()
  }

  return (
    <Container>
      <Fretboard>
        {STRINGS.map(({ h, frets }, stringIndex) =>
          frets.map((f, fretIndex) => (
            <FretCell key={`fret-${stringIndex}-${fretIndex}`} onClick={() => play(f)}>
              {fretIndex === 0 && <GuitarString height={h} />}
              {stringIndex === 2 && inlayPositions.includes(fretIndex) && <InlayDot $double={doubleInlayPositions.includes(fretIndex)} />}
            </FretCell>
          )),
        )}
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
const Fretboard = styled.div`
  display: grid;
  grid-template-columns: repeat(14, 64px);
  grid-template-rows: repeat(6, 35px);
  background-color: ${({ theme }) => theme.color.gray100};
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  position: relative;
`

const FretCell = styled.div`
  width: 64px;
  height: 35px;
  border-right: 1px solid ${({ theme }) => theme.color.gray700};
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;
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
  width: 200vh;
  box-shadow: 10px 5px 2px rgba(0, 0, 0, 0.1);
`

const InlayDot = styled.div<{ $double?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.gray500};
  position: absolute;
  z-index: 5;
  top: ${({ $double }) => ($double ? -41 : 29)}px;

  ${({ $double, theme }) =>
    $double &&
    `&:before {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: ${theme.color.gray600};
      top: 140px;
    }`}
`

export default GuitarComponents
