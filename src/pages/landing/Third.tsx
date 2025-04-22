import styled from 'styled-components'
import { Base, Drum, Guitar, Piano, Slider } from '../../assets'
import { useNavigate } from 'react-router-dom'

export const Third = () => {
  const navigate = useNavigate()
  const instruments = [
    {
      icon: <Piano />,
      name: '피아노',
      desc: '멜로디, 코드 반주용',
    },
    {
      icon: <Slider Fill="#F64422" />,
      name: '신스',
      desc: '다양한 음색으로 분위기 조성',
    },
    {
      icon: <Drum />,
      name: '드럼',
      desc: '리듬과 박자 연출',
    },
    {
      icon: <Guitar />,
      name: '기타',
      desc: '감성적인 아르페지오부터 리프까지',
    },
    {
      icon: <Base Fill="#F64422" />,
      name: '베이스',
      desc: '음악에 깊이를 더하는',
    },
  ]

  return (
    <Wrapper>
      <TitleBox>
        <Title>악기 소개</Title>
        <Description>
          위밋에서 가상 악기 피아노, 신스, 드럼, 기타로
          <br />
          악기 없이도 합주할 수 있어요
        </Description>
      </TitleBox>
      <IntroduceBox>
        <IntroduceTitle>가상악기 종류</IntroduceTitle>
        <InstrumentsList>
          {instruments.map(({ icon, name, desc }) => (
            <InstrumentItem key={name} onClick={() => navigate(`/instrument?name=${name}`)}>
              <InstrumentIcon>{icon}</InstrumentIcon>
              <InstrumentInfo>
                <InstrumentName>{name}</InstrumentName>
                <InstrumentDesc>{desc}</InstrumentDesc>
              </InstrumentInfo>
            </InstrumentItem>
          ))}
        </InstrumentsList>
        <MoreButton onClick={() => navigate('/instrument')}>연주하러 가기</MoreButton>
      </IntroduceBox>
    </Wrapper>
  )
}

const MoreButton = styled.button`
  all: unset;
  width: 100%;
  text-align: center;
  padding: 16px 0;
  background-color: ${({ theme }) => theme.color.gray50};
  color: ${({ theme }) => theme.color.gray600};
  font-weight: 500;
  cursor: pointer;
  transition: background-color 0.2s ease;

  &:hover {
    background-color: ${({ theme }) => theme.color.gray100};
    color: ${({ theme }) => theme.color.gray800};
  }
`

const Wrapper = styled.div`
  width: 100%;
  padding: 100px 24px;
  background-color: #fff;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 60px;
`

const IntroduceBox = styled.div`
  border: 1px solid ${({ theme }) => theme.color.gray300};
  border-radius: 12px;
  background-color: #fff;
  width: 100%;
  max-width: 480px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  background-color: #fff;
  box-shadow: 0 0 20px 0 rgba(0, 0, 0, 0.08);
`

const IntroduceTitle = styled.div`
  width: 100%;
  display: flex;
  padding: 16px;
  justify-content: center;
  border-bottom: 2px solid ${({ theme }) => theme.color.gray200};
  background-color: ${({ theme }) => theme.color.orange50};
  color: ${({ theme }) => theme.color.orange500};
  ${({ theme }) => theme.font.body1}
`
const InstrumentsList = styled.div`
  display: flex;
  flex-direction: column;
`

const InstrumentItem = styled.div`
  display: flex;
  align-items: center;
  gap: 20px;
  padding: 40px 24px;
  background-color: #fff;
  transition: all 0.2s ease;
  cursor: pointer;
  border-bottom: 2px solid ${({ theme }) => theme.color.gray100};
  &:hover {
    background-color: ${({ theme }) => theme.color.gray50};
  }
`

const InstrumentIcon = styled.div`
  width: 60px;
  height: 60px;
  border-radius: 100%;
  background-color: ${({ theme }) => theme.color.orange100};
  flex-shrink: 0;
  display: flex;
  justify-content: center;
  align-items: center;

  svg {
    width: 32px;
    height: 32px;
    fill: ${({ theme }) => theme.color.orange500};
  }
`

const InstrumentInfo = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const InstrumentName = styled.p`
  ${({ theme }) => theme.font.body2};
  color: ${({ theme }) => theme.color.gray900};
`

const InstrumentDesc = styled.p`
  ${({ theme }) => theme.font.body4};
  color: ${({ theme }) => theme.color.gray500};
`

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
`

const Title = styled.p`
  ${({ theme }) => theme.font.header2}
`

const Description = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.color.gray500};
  ${({ theme }) => theme.font.body4}
`
