import React, { useEffect, useState, useRef } from 'react'
import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import * as Tone from 'tone'

import { CloseBlack, Lock, LogOut, Mike, MikeOff } from '../assets'
import { useEntryRoom, useExitConcertRoom, useGetRoomInfo } from '../apis/room'
import { FeaturePanel } from '../components/FeaturePanel'
import { InviteCodeBox } from '../components/InviteCodeBox'
import { useMicrophone } from '../hooks/useMicrophone'
import { useAudioConnectionNN } from '../hooks/useAudioConnection'
import { useUserStore } from '../stores/UserStores'
import { InstrumentType } from '../utils/type'
import GuitarComponents from '../components/Guitar'
import { DrumComponents } from '../components/Drum'
import { BassComponents } from '../components/Bass'
import { PianoComponents } from '../components/Piano'
import { Synthesizer } from '../components/Synthesizer'
import { useParticipantsStore } from '../stores/useParticipantsStore'
import { UserVideo } from '../components/UserVideo'

export const ConcertRoom = () => {
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(useLocation().search)
  const roomId = searchParams.get('id')!
  const owner = searchParams.get('owner')

  const { mikeOn, toggleMike, audioStream, getLocalAudioStream } = useMicrophone()
  const { user } = useUserStore()
  const { participants } = useParticipantsStore()

  console.log('part', participants)

  type FeatureType = 'instrument' | 'volume'
  const [activeFeature, setActiveFeature] = useState<FeatureType | null>(null)
  const [isSocketReady, setIsSocketReady] = useState<boolean>(false)
  const [hasEntered, setHasEntered] = useState<boolean>(false)
  const [isAudioStarted, setIsAudioStarted] = useState<boolean>(false)
  const [instrument, setInstrument] = useState<InstrumentType | undefined>(undefined)

  const localAudioRef = useRef<HTMLAudioElement | null>(null)
  const remoteAudioRefs = useRef<Record<string, React.RefObject<HTMLAudioElement | null>>>({})

  useEffect(() => {
    if (localAudioRef.current) {
      localAudioRef.current.muted = true
      localAudioRef.current.volume = 0
    }
  }, [])

  const { mutate: exitRoom } = useExitConcertRoom(
    {
      onSuccess: () => navigate('/main'),
      onError: () => alert('잠시 후 시도해주세요'),
    },
    roomId,
  )

  const { data: RoomData } = useGetRoomInfo(roomId, hasEntered)

  const { mutate: entryRoom } = useEntryRoom(
    {
      onSuccess: () => {
        setIsSocketReady(true)
        setHasEntered(true)
      },
      onError: (error) => {
        if (error.message === 'Request failed with status code 409') {
          exitRoom()
        } else {
          alert('잠시 후 다시 시도해주세요')
          navigate('/main')
        }
      },
    },
    roomId,
  )

  const handleStartAudio = async () => {
    await Tone.start()
    console.log('🔊 AudioContext started by user interaction')
    setIsAudioStarted(true)
  }

  useEffect(() => {
    if (!owner) {
      entryRoom()
    } else {
      setIsSocketReady(true)
    }
  }, [entryRoom, owner])

  useEffect(() => {
    participants.forEach((p) => {
      if (!remoteAudioRefs.current[p.accountId]) {
        remoteAudioRefs.current[p.accountId] = React.createRef<HTMLAudioElement>()
      }
    })
  }, [participants])

  useAudioConnectionNN(isSocketReady && isAudioStarted, remoteAudioRefs.current, user?.accountId || '', audioStream, getLocalAudioStream)

  return (
    <Container>
      {!isAudioStarted && (
        <AudioStartOverlay>
          <button onClick={handleStartAudio}>오디오 시작하기</button>
        </AudioStartOverlay>
      )}
      <Content>
        <audio ref={localAudioRef} id="local-audio" autoPlay playsInline muted={true} />
        {participants.map((p) => {
          console.log('qwer' + p.audioRef)
          console.log(p.audioRef.current?.volume) // 1.0 이어야 정상
          console.log(p.audioRef.current?.muted) // false 여야 함

          return (
            <audio
              key={p.mail}
              ref={p.audioRef}
              autoPlay
              playsInline
              muted={true}
              onPlay={() => console.log(`🎵 ${p.mail}의 오디오 재생 시작`)}
              onError={(e) => console.error(`❌ ${p.mail}의 오디오 에러:`, e)}
            >
              <track kind="captions" />
            </audio>
          )
        })}

        <TopBar>
          <TitleWrap>
            <Title>
              {RoomData?.name} {RoomData?.password && <img src={Lock} alt="비공개" />}
            </Title>
            <Description>{RoomData?.info}</Description>
          </TitleWrap>
          {RoomData?.password && <InviteCodeBox code={RoomData.password} />}
        </TopBar>

        <VideoWrap $active={instrument}>
          {instrument && (
            <Close onClick={() => setInstrument(undefined)}>
              <img src={CloseBlack} alt="악기닫기" />
            </Close>
          )}
          {(activeFeature === 'instrument' || instrument) &&
            (() => {
              switch (instrument) {
                case '기타':
                  return <GuitarComponents />
                case '드럼':
                  return <DrumComponents />
                case '베이스':
                  return <BassComponents />
                case '피아노':
                  return <PianoComponents />
                case '신스':
                  return <Synthesizer />
                default:
                  return null
              }
            })()}

          {!instrument && participants.map((item) => item.accountId && <UserVideo key={item.accountId} accountId={item.accountId} onClick={() => {}} img={item.profile} />)}
        </VideoWrap>

        <BottomBarWrap>
          <FeatureButton onClick={toggleMike}>
            <img src={mikeOn ? Mike : MikeOff} alt="마이크" />
          </FeatureButton>

          <FeaturePanel
            handleToggleInstrument={(instrument) => {
              console.log('🎸 선택된 악기:', instrument)
              setInstrument(instrument)
            }}
            handleChangeVolume={(volume) => {
              console.log('🔊 볼륨 조절:', volume)
              if (localAudioRef.current) {
                localAudioRef.current.volume = volume / 100
              }
            }}
            activeInstrument={instrument}
            activeFeature={activeFeature}
            handleToggleFeature={setActiveFeature}
          />

          <ButtonWrapper onClick={() => exitRoom()}>
            <LogOut Fill="white" />
          </ButtonWrapper>
        </BottomBarWrap>
      </Content>
    </Container>
  )
}

const Container = styled.div`
  margin: 0 auto;
  max-width: 1280px;
`

const Content = styled.div`
  padding: 100px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 24px;
  width: 100%;
  height: 100dvh;
`

const TopBar = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 24px 0px;
`

const TitleWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Title = styled.h1`
  ${({ theme }) => theme.font.title1};
  color: #000;
`

const Description = styled.p`
  ${({ theme }) => theme.font.body6};
  color: ${({ theme }) => theme.color.gray500};
`

const VideoWrap = styled.div<{ $active?: 'instrument' | 'volume' | null | InstrumentType }>`
  display: ${({ $active }) => ($active ? '' : 'grid')};
  grid-template-columns: ${({ $active }) => ($active ? '' : 'repeat(2, minmax(0, 1fr))')};
  gap: 10px;
  width: 100%;
  height: 100%;
  margin: auto;
  padding: ${({ $active }) => ($active ? '' : '0px 44px 80px 44px')};

  @media (max-width: 1440px) {
    width: ${({ $active }) => ($active ? '' : '70%')};
  }
  position: relative;
`

const BottomBarWrap = styled.div`
  position: absolute;
  bottom: 2%;
  width: 100%;
  display: flex;
  gap: 16px;
  justify-content: center;
  left: 0;
`

const ButtonWrapper = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.orange500};
  color: ${({ theme }) => theme.color.gray100};
  cursor: pointer;
`

const FeatureButton = styled.button`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.gray100};
  cursor: pointer;
`

const AudioStartOverlay = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  z-index: 9999;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  display: flex;
  align-items: center;
  justify-content: center;

  button {
    padding: 1rem 2rem;
    font-size: 1.25rem;
    background-color: #f75c3c;
    color: white;
    border: none;
    border-radius: 12px;
    cursor: pointer;
  }
`

const Close = styled.div`
  position: absolute;
  right: 16px;
  top: 16px;
  z-index: 100;
`
