import { useState } from 'react'
import styled from 'styled-components'
import { Smile } from '../../assets'

export const Second = () => {
  const [opened, setOpened] = useState(false)
  return (
    <Wrapper>
      <LetterBox>
        <Sticker onClick={() => setOpened(true)} opened={opened} src={Smile} />
        <LetterEnvelope>
          <LetterPaper opened={opened}>
            <Phrase>
              환영해요!
              <br />
              가상 악기, 이펙터, 음성 채팅까지
              <br />
              온라인에서도 완벽한 합주 경험을 즐겨보세요
            </Phrase>
          </LetterPaper>
          <Fold opened={opened} isLeft />
          <Fold opened={opened} />
          <BottomFoldWrapper opened={opened}>
            <BottomFold />
          </BottomFoldWrapper>
        </LetterEnvelope>
        <Flap opened={opened} />
      </LetterBox>
    </Wrapper>
  )
}

const Sticker = styled.img<{ opened?: boolean }>`
  position: absolute;
  width: 100px;
  top: 200px;
  left: 50%;
  transform: translate(-50%, -50%);
  opacity: ${({ opened }) => (opened ? 0 : 90)}%;
  filter: drop-shadow(0 2px 4px rgba(0, 0, 0, 0.2));
  transition: all 0.2s ease;
  z-index: 11;
  cursor: pointer;
`

const Wrapper = styled.div`
  width: 100%;
  height: 800px;
  background-color: #fff;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  padding-top: 100px;
`

const LetterBox = styled.div`
  position: relative;
`

const LetterEnvelope = styled.div`
  width: 460px;
  height: 300px;
  background-color: ${({ theme }) => theme.color.gray100};
  position: relative;
`

const BottomFoldWrapper = styled.div<{ opened?: boolean }>`
  position: absolute;
  bottom: 0;
  left: 0;
  width: 460px;
  height: 160px;
  overflow: visible;
  filter: drop-shadow(0 0 2px rgba(0, 0, 0, 0.1));
  z-index: ${({ opened }) => (opened ? 5 : 2)};
`

const BottomFold = styled.div`
  width: 100%;
  height: 100%;
  background-color: #fff;
  clip-path: polygon(40% 0%, 60% 0%, 100% 100%, 0% 100%);
`

const Fold = styled.div<{ isLeft?: boolean; opened?: boolean }>`
  position: absolute;
  bottom: 0;
  width: 0;
  height: 0;
  border-bottom: 300px solid #fff;
  border-left: 320px solid transparent;
  z-index: 2;
  ${({ isLeft }) =>
    isLeft
      ? 'right: 0;'
      : `
    left: 0;
    transform: scale(-1, 1);
  `};
  filter: drop-shadow(0 4px 40px rgba(0, 0, 0, 0.1));
  z-index: ${({ opened }) => (opened ? 5 : 2)};
`

const LetterPaper = styled.div<{ opened?: boolean }>`
  width: 400px;
  height: 300px;
  background-color: #fff;
  background-image: repeating-linear-gradient(to bottom, transparent, transparent 27px, #dcdcdc 28px);
  border: 1px solid #c9c9c9;
  position: absolute;
  top: 50%;
  left: 50%;
  transform: ${({ opened }) => (opened ? 'translate(-50%, -80%)' : 'translate(-50%, -50%)')};
  transition: transform 0.7s ease-in-out 1s;
  z-index: ${({ opened }) => (opened ? 4 : 1)};
`

const Phrase = styled.p`
  line-height: 28px;
  width: 100%;
  text-align: center;
  margin-top: 40px;
  ${({ theme }) => theme.font.body1}
`

const Flap = styled.div<{ opened: boolean }>`
  will-change: auto;
  position: absolute;
  top: 0;
  left: 0;
  width: 0;
  height: 0;
  border-left: 230px solid transparent;
  border-right: 230px solid transparent;
  border-top: ${({ opened }) => (opened ? 170 : 230)}px solid ${({ opened, theme }) => (opened ? theme.color.gray100 : '#fff')};
  transform-origin: top center;
  transform: ${({ opened }) => (opened ? 'rotateX(180deg)' : 'rotateX(0deg)')};
  transition: transform 0.7s ease-in-out, border-top-color 0.7s ease-in-out;
  z-index: 3;
  ${({ opened }) => !opened && 'filter: drop-shadow(0px 0px 2px rgba(0, 0, 0, 0.1))'}
`
