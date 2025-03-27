import { useEffect, useState } from 'react'
import styled, { CSSProperties } from 'styled-components'

interface ElementProps {
  src?: string
  style?: CSSProperties
  onClick: () => void
  note: string
  type?: 'tom' | 'cymbal'
}

export const DrumElement = ({ src, style, onClick, note, type = 'tom' }: ElementProps) => {
  const [isHit, setIsHit] = useState(false)

  const handleMouseDown = () => {
    onClick()
    setIsHit(true)
    setTimeout(() => setIsHit(false), 300)
  }

  const onKeyDown = (event: KeyboardEvent) => {
    if (note === event.code) {
      handleMouseDown()
    }
  }

  useEffect(() => {
    window.addEventListener('keydown', onKeyDown)
    return () => {
      window.removeEventListener('keydown', onKeyDown)
    }
  }, [])

  return <Layout type={type} isHit={isHit} style={style} src={src} onMouseDown={handleMouseDown} />
}

const Layout = styled.img<{ isHit: boolean; type: 'tom' | 'cymbal' }>`
  position: absolute;
  z-index: 100;
  cursor: pointer;

  animation: ${({ isHit, type }) => isHit && (type === 'tom' ? 'tomHit 0.3s ease-out' : 'cymbalHit 0.6s ease-out')};

  @keyframes cymbalHit {
    0% {
      transform: rotate(0) scaleY(1);
    }
    10% {
      transform: rotate(-18deg) scaleY(0.85); /* 더 강하게 눌림 */
    }
    20% {
      transform: rotate(14deg) scaleY(1.1); /* 더 높이 튕겨 오름 */
    }
    30% {
      transform: rotate(-10deg) scaleY(0.95);
    }
    40% {
      transform: rotate(8deg) scaleY(1.05);
    }
    50% {
      transform: rotate(-6deg) scaleY(0.98);
    }
    60% {
      transform: rotate(4deg) scaleY(1.02);
    }
    70% {
      transform: rotate(-3deg) scaleY(0.99);
    }
    80% {
      transform: rotate(2deg) scaleY(1.01);
    }
    90% {
      transform: rotate(-1deg) scaleY(1);
    }
    100% {
      transform: rotate(0) scaleY(1);
    }
  }

  @keyframes tomHit {
    0% {
      transform: scale(1) translateY(0);
    }
    10% {
      transform: scale(1.1) translateY(-5px);
    }
    20% {
      transform: scale(0.9) translateY(3px);
    }
    30% {
      transform: scale(1.05) translateY(-2px);
    }
    40% {
      transform: scale(0.95) translateY(1px);
    }
    50% {
      transform: scale(1.02) translateY(-1px);
    }
    60% {
      transform: scale(1) translateY(0);
    }
    100% {
      transform: scale(1) translateY(0);
    }
  }
`
