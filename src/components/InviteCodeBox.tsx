import styled from 'styled-components'
import { Copy } from '../assets'
import { useRef } from 'react'

export const InviteCodeBox = () => {
  const codeRef = useRef<HTMLParagraphElement>(null)

  const handleCopyClipBoard = async () => {
    if (codeRef.current) {
      await navigator.clipboard.writeText(codeRef.current.innerText)
      alert('초대 코드가 복사되었습니다')
    }
  }

  return (
    <CodeWrap>
      <CodeText>초대 코드</CodeText>
      <Code>
        <p ref={codeRef}>0123</p>
        <CopyImg src={Copy} alt="코드 복사" onClick={handleCopyClipBoard} />
      </Code>
    </CodeWrap>
  )
}

const CodeWrap = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const CodeText = styled.p`
  ${({ theme }) => theme.font.body4};
  color: ${({ theme }) => theme.color.gray700};
`

const Code = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 12px;
  gap: 10px;
  background-color: ${({ theme }) => theme.color.gray50};
  border: 1px solid ${({ theme }) => theme.color.gray200};
  border-radius: 6px;
`

const CopyImg = styled.img`
  width: 20px;
  height: 20px;
  cursor: pointer;
`

