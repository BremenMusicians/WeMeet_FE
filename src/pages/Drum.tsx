import { useEffect } from 'react'
import styled from 'styled-components'
import { DrumImage, HiHat, Crash, Ride, LargeTom, FloorTom, SmallTom, Snare, Kick, Pedal } from '../assets'
import { DrumElement } from '../components/DrumElement'
import { CrashSound, RideSound, PedalSound, KickSound, SnareSound, FloorTomSound, LargeTomSound, SmallTomSound, HiHatSound } from '../sounds'

export const Drum = () => {
  const play = (sound: string) => {
    const audio = new Audio(sound)
    audio.play()
  }

  const keyMap: any = {
    KeyX: KickSound,
    KeyZ: PedalSound,
  }

  const onKeyDown = (event: any) => {
    if (keyMap[event.code]) {
      play(keyMap[event.code])
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return (
    <Container>
      <Layout>
        <ImageBox>
          <BackgroundImage src={DrumImage} />
          <DrumElement type="cymbal" note="KeyQ" style={{ top: '162px', left: '27px' }} src={HiHat} onClick={() => play(HiHatSound)} />
          <DrumElement type="cymbal" note="KeyW" style={{ top: '12px', left: '149px' }} src={Crash} onClick={() => play(CrashSound)} />
          <DrumElement type="cymbal" note="KeyE" style={{ top: '100px', right: '45px' }} src={Ride} onClick={() => play(RideSound)} />
          <DrumElement note="KeyA" style={{ top: '282px', left: '207px' }} src={Snare} onClick={() => play(SnareSound)} />
          <DrumElement note="KeyS" style={{ top: '150px', left: '245px' }} src={SmallTom} onClick={() => play(SmallTomSound)} />
          <DrumElement note="KeyD" style={{ top: '150px', right: '217px' }} src={LargeTom} onClick={() => play(LargeTomSound)} />
          <DrumElement note="KeyF" style={{ top: '257px', right: '129px' }} src={FloorTom} onClick={() => play(FloorTomSound)} />

          <PedalImg src={Pedal} onClick={() => play(PedalSound)} />
          <KickImg src={Kick} onClick={() => play(KickSound)} />
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

const BackgroundImage = styled.img``

const PedalImg = styled.img`
  top: 376px;
  left: 180px;
  position: absolute;
  cursor: pointer;
  transition: transform 0.1s ease-in-out;

  &:active {
    transform: scale(0.95) translateY(10px);
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
