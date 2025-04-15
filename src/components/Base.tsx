import { useState } from 'react'
import styled, { keyframes, css } from 'styled-components'
import { BaseHeader } from '../assets'

const STRINGS = [
  { name: 'g', frets: ['g0', 'g1', 'g2', 'g3', 'g4', 'g5'] },
  { name: 'd', frets: ['d0', 'd1', 'd2', 'd3', 'd4', 'd5'] },
  { name: 'a', frets: ['a0', 'a1', 'a2', 'a3', 'a4', 'a5'] },
  { name: 'e', frets: ['e0', 'e1', 'e2', 'e3', 'e4', 'e5'] },
]
const SOUND_URL = import.meta.env.VITE_BASE_SOUND_URL

export const BaseComponents = () => {
  const baseFrets = [4, 5, 5, 8]
  const [vibrateIndex, setVibrateIndex] = useState<number | null>(null)

  const play = (sound: string, stringIndex: number) => {
    const audio = new Audio(`${SOUND_URL}/${sound}.mp3`)
    audio.play()
    setVibrateIndex(stringIndex)
    setTimeout(() => setVibrateIndex(null), 300)
  }

  return (
    <Container>
      <Content>
        <ImgContainer>
          <BaseHeaderImg src={BaseHeader} alt="베이스 머리" />
          <TopCircle />
          <BottomCircle />
        </ImgContainer>
        <BaseContent>
          {STRINGS.map((string, lineIndex) => (
            <FretBox key={`string-${lineIndex}`}>
              <GuitarString $vibrating={vibrateIndex === lineIndex} height={baseFrets[lineIndex]} />
              {string.frets.map((item, fretIndex) => (
                <Fret key={`fret-${lineIndex}-${fretIndex}`} onClick={() => play(item, lineIndex)} />
              ))}
            </FretBox>
          ))}
        </BaseContent>
      </Content>
    </Container>
  )
}

const FretBox = styled.div`
  width: 860px;
  display: flex;
  position: relative;
`

const ImgContainer = styled.div`
  position: relative;
`

const GuitarString = styled.span<{ height: number; $vibrating: boolean }>`
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
  box-shadow: 0px 5px 2px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  ${({ $vibrating }) =>
    $vibrating &&
    css`
      animation: ${vibrate} 0.3s linear;
    `}
`

const BaseHeaderImg = styled.img`
  height: 250px;
`

const vibrate = keyframes`
  0% { transform: translateY(0px); }
  10% { transform: translateY(-2px); }
  20% { transform: translateY(2px); }
  30% { transform: translateY(-1.5px); }
  40% { transform: translateY(1.5px); }
  50% { transform: translateY(-1px); }
  60% { transform: translateY(1px); }
  70% { transform: translateY(-0.5px); }
  80% { transform: translateY(0.5px); }
  100% { transform: translateY(0px); }
`

const Fret = styled.div`
  border-left: 1px solid ${({ theme }) => theme.color.gray700};
  border-right: 1px solid ${({ theme }) => theme.color.gray700};
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  width: 100%;
  height: 50px;
  align-items: center;

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`

const Content = styled.div`
  display: flex;
  margin: auto;
`

const BaseContent = styled.div`
  border: 1px solid ${({ theme }) => theme.color.gray200};
  display: flex;
  flex-direction: column;
  background-color: #f3f3f3;
  margin: auto;
`

const Container = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  height: 70dvh;
`

const TopCircle = styled.div`
  width: 200px;
  height: 100px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  top: -10%;
  left: 100%;
  transform: translate(-50%, -50%);
`

const BottomCircle = styled.div`
  width: 200px;
  height: 100px;
  border-radius: 50%;
  background-color: white;
  position: absolute;
  bottom: -50%;
  left: 100%;
  transform: translate(-50%, -50%);
`
