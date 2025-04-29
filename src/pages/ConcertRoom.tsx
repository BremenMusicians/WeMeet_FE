import styled from 'styled-components'
import { useNavigate, useLocation } from 'react-router-dom'
import { useEffect, useState } from 'react'
import { UserVideo } from '../components/UserVideo'
import { Lock, LogOut, Mike, MikeOff } from '../assets'
import { useEntryRoom, useExitConcertRoom } from '../apis/room'
import { FeaturePanel } from '../components/FeaturePanel'
import { InviteCodeBox } from '../components/InviteCodeBox'
import { useMicrophone } from '../hooks/useMicrophone'
import { useConcertSocket } from '../hooks/useCurrentSocket'
import { useAudioConnection } from '../hooks/useAudioConnection'

export const ConcertRoom = () => {
  const navigate = useNavigate()
  const searchParams = new URLSearchParams(useLocation().search)
  const roomId = searchParams.get('id')!
  const owner = searchParams.get('owner')

  const { mikeOn, toggleMike, audioStream } = useMicrophone()
  useAudioConnection(roomId, audioStream)
  const [activeFeature, setActiveFeature] = useState<'instrument' | 'volume' | null>(null)
  const { data, KickMember } = useConcertSocket(roomId)

  const { mutate: exitRoom } = useExitConcertRoom({ onSuccess: () => navigate('/main'), onError: () => alert('잠시 후 시도해주세요') }, roomId)

  const { mutate: entryRoom } = useEntryRoom(
    {
      onSuccess: () => {},
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

  useEffect(() => {
    if (!owner) {
      entryRoom()
    }
  }, [entryRoom, owner])

  return (
    <Container>
      <Content>
        <audio id="remote-audio" autoPlay playsInline />
        <TopBar>
          <TitleWrap>
            <Title>
              걸어서 집으로 <img src={Lock} alt="비공개" />
            </Title>
            <Description>키보드 구합니다 매우매우 급함 키보드 올 때까지 숨 참음</Description>
          </TitleWrap>
          <InviteCodeBox />
        </TopBar>
        <VideoWrap>
          {Array.isArray(data?.payload) &&
            data.payload.map((item) => <UserVideo img={item.profile} key={item.mail} accountId={item.accountId} owner={!!owner} onClick={() => KickMember(item.mail)} />)}
        </VideoWrap>
        <BottomBarWrap>
          <FeatureButton onClick={toggleMike}>
            <img src={mikeOn ? Mike : MikeOff} alt="마이크" />
          </FeatureButton>
          <FeaturePanel activeFeature={activeFeature} handleToggleFeature={setActiveFeature} />
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
const VideoWrap = styled.div`
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 10px;
  width: 100%;
  height: 100%;
  margin: auto;
  padding: 0px 44px;
  @media (max-width: 1440px) {
    width: 70%;
  }
`
const BottomBarWrap = styled.div`
  display: flex;
  gap: 16px;
  margin: 0 auto;
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
