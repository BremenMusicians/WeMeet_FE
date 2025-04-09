import styled from 'styled-components'
import { Star, Snow, Smile, Logo, Eyes, Double_Down_Arrow } from '../../assets'

export const First = () => {
  return (
    <Wrapper>
      <Container>
        <Twinkle src={Star} top={200} left={54} />
        <Twinkle src={Snow} top={200} right={124} />
        <Twinkle src={Snow} top={340} left={24} />
        <Twinkle src={Star} top={300} right={24} />
        <Twinkle src={Star} top={360} right={34} />
        <Twinkle src={Snow} top={700} right={34} />

        <Sticker src={Smile} top={340} left={80} />
        <Sticker src={Eyes} top={520} right={60} />

        <Logo size="60%" color="#fff" />
      </Container>
      <ScrollDown>
        아래로 스크롤해주세요
        <img width={28} src={Double_Down_Arrow} />
      </ScrollDown>
    </Wrapper>
  )
}

const Container = styled.div`
  max-width: 1000px;
  width: 100%;
  height: 100vh;
  padding-top: 70px;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
`

const Wrapper = styled.div`
  background-color: ${({ theme }) => theme.color.orange500};
  display: flex;
  justify-content: center;
  width: 100%;
  overflow: hidden;
  position: relative;
`

const Twinkle = styled.img<{ top?: number; left?: number; right?: number }>`
  position: absolute;
  ${({ top }) => top !== undefined && `top: ${top}px;`}
  ${({ left }) => left !== undefined && `left: ${left}px;`}
${({ right }) => right !== undefined && `right: ${right}px;`}
width: 40px;
  height: 40px;
  opacity: 0.9;

  animation: twinkle 2s steps(2, end) infinite;
  @keyframes twinkle {
    0% {
      transform: scale(1) rotate(0deg);
    }
    50% {
      transform: scale(1.2) rotate(20deg);
    }
    100% {
      transform: scale(1) rotate(0deg);
    }
  }
`

const Sticker = styled.img<{ top?: number; left?: number; right?: number }>`
  position: absolute;
  ${({ top }) => top !== undefined && `top: ${top}px;`}
  ${({ left }) => left !== undefined && `left: ${left}px;`}
  ${({ right }) => right !== undefined && `right: ${right}px;`}
  opacity: 0.9;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: transform 0.2s ease;
  &:hover {
    transform: scale(1.2) rotate(10deg);
  }
`

const ScrollDown = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  align-items: center;
  position: absolute;
  bottom: 40px;
  font-size: 14px;
  color: #fff;
  opacity: 0.8;
  animation: bounce 1.6s infinite;

  @keyframes bounce {
    0% {
      transform: translateY(0);
      opacity: 0.7;
    }
    50% {
      transform: translateY(10px);
      opacity: 1;
    }
    100% {
      transform: translateY(0);
      opacity: 0.7;
    }
  }
`
