import React, { useState } from 'react'
import styled, { keyframes } from 'styled-components'

function GuitarComponents() {
  // 기타줄 크기
  const guitarFrets = [2, 2.4, 3, 3.6, 4.2, 5]
  // 마커 위치
  const inlayPositions = [2, 4, 6, 8, 11]
  // 한줄에 마커 두개 위치
  const doubleInlayPositions = [11]

  return (
    <Container>
      <Fretboard>
        {guitarFrets.map((h, lineIndex) => (
          <React.Fragment key={`string-${lineIndex}`}>
            <FretBox>
              <String height={h} />
              {Array.from({ length: 13 }).map((_, fretIndex) => (
                <Fret key={`fret-${lineIndex}-${fretIndex}`}>{lineIndex === 2 && inlayPositions.includes(fretIndex) && <InlayDot double={doubleInlayPositions.includes(fretIndex)} />}</Fret>
              ))}
            </FretBox>
          </React.Fragment>
        ))}
      </Fretboard>
    </Container>
  )
}

const Container = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 70dvh;
`

const FretBox = styled.div`
  width: 900px;
  display: flex;
  position: relative;
`

const Fret = styled.div`
  width: 64px;
  height: 35px;
  border-right: 1px solid ${({ theme }) => theme.color.gray700};
  cursor: pointer;
  position: relative;
  display: flex;
  justify-content: center;
  align-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.color.gray200};
  }

  &:active {
    background-color: rgba(255, 255, 255, 0.2);
  }
`

const Fretboard = styled.div`
  display: flex;
  flex-direction: column;
  background-color: ${({ theme }) => theme.color.gray100};
  border-radius: 5px;
  overflow: hidden;
  border: 1px solid ${({ theme }) => theme.color.gray200};
`

const String = styled.span<{ height: number }>`
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
`

const InlayDot = styled.div<{ double?: boolean }>`
  width: 12px;
  height: 12px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.gray500};
  position: absolute;
  z-index: 5;
  top: ${({ double }) => (double ? -41 : 29)}px;

  ${(props) =>
    props.double &&
    `
    &:before {
      content: '';
      position: absolute;
      width: 12px;
      height: 12px;
      border-radius: 50%;
      background-color: ${props.theme.color.gray600};
      top: 140px;
    }
  `}
`

export default GuitarComponents
