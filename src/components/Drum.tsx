import { useEffect, useRef } from 'react'
import styled from 'styled-components'
import { DrumImage, HiHat, Crash, Ride, LargeTom, FloorTom, SmallTom, Snare, Kick, Pedal } from '../assets'
import { DrumElement } from './DrumElement'

const SOUND_URL = import.meta.env.VITE_DRUM_SOUND
const SOUND_LIST = ['hihat', 'crash', 'ride', 'snare-drum', 'tom1', 'tom2', 'floor-tom', 'hihat-foot', 'bass']

export const DrumComponents = () => {
  const pressedKeys = useRef<Set<string>>(new Set())
  const play = (sound: string) => {
    const audio = new Audio(`${SOUND_URL}/${sound}.mp3`)
    audio.play().catch((error) => {
      console.error(`사운드 재생 오류 ${sound}:`, error)
    })
  }

  useEffect(() => {
    const audios: HTMLAudioElement[] = SOUND_LIST.map((sound) => {
      const audio = new Audio(`${SOUND_URL}/${sound}.mp3`)
      audio.load()
      return audio
    })
  }, [])

  const keyMap: Record<string, string> = {
    KeyX: 'hihat-foot',
    KeyZ: 'bass',
  }

  const onKeyDown = (e: KeyboardEvent) => {
    if (!pressedKeys.current.has(e.code) && keyMap[e.code]) {
      pressedKeys.current.add(e.code)
      play(keyMap[e.code])
    }
  }

  const onKeyUp = (e: KeyboardEvent) => {
    pressedKeys.current.delete(e.code)
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    window.addEventListener('keyup', onKeyUp)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
      window.addEventListener('keyup', onKeyUp)
    }
  }, [])

  return (
    <Container>
      <Layout>
        <ImageBox>
          <img src={DrumImage} />
          <DrumElement type="cymbal" note="q" style={{ top: '162px', left: '27px' }} src={HiHat} onClick={() => play('hihat')} />
          <DrumElement type="cymbal" note="w" style={{ top: '12px', left: '149px' }} src={Crash} onClick={() => play('crash')} />
          <DrumElement type="cymbal" note="e" style={{ top: '100px', right: '45px' }} src={Ride} onClick={() => play('ride')} />
          <DrumElement note="a" style={{ top: '282px', left: '207px' }} src={Snare} onClick={() => play('snare-drum')} />
          <DrumElement note="s" style={{ top: '150px', left: '245px' }} src={SmallTom} onClick={() => play('tom1')} />
          <DrumElement note="d" style={{ top: '150px', right: '217px' }} src={LargeTom} onClick={() => play('tom2')} />
          <DrumElement note="f" style={{ top: '257px', right: '129px' }} src={FloorTom} onClick={() => play('floor-tom')} />
          <PedalImg src={Pedal} onClick={() => play('hihat-foot')} />
          <KickImg src={Kick} onClick={() => play('bass')} />
        </ImageBox>
      </Layout>
    </Container>
  )
}

const Container = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Layout = styled.div`
  margin-top: 80px;
  padding: 24px;
  max-width: 1280px;
  width: 100%;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  background-color: ${({ theme }) => theme.color.gray50};
  display: flex;
  justify-content: center;
`

const ImageBox = styled.div`
  width: fit-content;
  height: fit-content;
  position: relative;
`

const PedalImg = styled.img`
  top: 376px;
  left: 180px;
  position: absolute;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
  &:active {
    transform: scale(0.95);
  }
`

const KickImg = styled.img`
  top: 326px;
  left: 316px;
  position: absolute;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;
  &:active {
    transform: scale(0.95) translateY(10px);
  }
`
