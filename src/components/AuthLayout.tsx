import styled from 'styled-components'
import { House, Logo, Letters_Logo, WelcomeIllust } from '../assets'

interface LayoutProps {
  title: string
  description: string
  children: React.ReactNode
}

export const AuthLayout = ({ title, description, children }: LayoutProps) => {
  return (
    <Container>
      <AuthContainer>
        <Header>
          <LogoIcon width={120} src={Letters_Logo} />
          <HouseButton>
            <HouseIcon src={House} />
          </HouseButton>
        </Header>
        <AuthFormBox>
          <LogoIcon width={80} src={Logo} />
          <TitleBox>
            <Title>{title}</Title>
            <Description>{description}</Description>
          </TitleBox>
          {children}
        </AuthFormBox>
        <NoticeText>
          원활한 사용을 위해 최신 브라우저를 사용하고, 오디오 장치가
          <br />
          정상적으로 연결되었는지 확인하세요.
        </NoticeText>
      </AuthContainer>
      <SideBanner>
        <SideBannerImg src={WelcomeIllust} />
      </SideBanner>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  width: 100%;
  height: 100vh;
`

const AuthContainer = styled.div`
  max-width: 786px;
  width: 100%;
  padding: 24px 24px 40px;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-between;

  @media (max-width: 960px) {
    max-width: 100%;
  }
`

const Header = styled.header`
  display: flex;
  width: 100%;
  justify-content: space-between;
`

const HouseButton = styled.button`
  display: flex;
  padding: 8px;
  border-radius: 6px;
  background-color: var(--gray100);
  border: 1px solid var(--gray200);
  cursor: pointer;
  &:hover {
    background-color: var(--gray200);
  }

  transition-property: all;
  transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
  transition-duration: 150ms;
`

const AuthFormBox = styled.div`
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`

const TitleBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const SideBanner = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: var(--orange500);
  @media (max-width: 960px) {
    display: none;
  }
`

const SideBannerImg = styled.img`
  object-fit: scale-down;
  width: 100%;
`

const NoticeText = styled.p`
  text-align: center;
  color: ${({ theme }) => theme.color.gray400};
  ${({ theme }) => theme.font.body6}
`

const LogoIcon = styled.img``
const HouseIcon = styled.img``

const Title = styled.p`
  ${({ theme }) => theme.font.header3}
`
const Description = styled.p`
  color: ${({ theme }) => theme.color.gray500};
  ${({ theme }) => theme.font.body4}
`
