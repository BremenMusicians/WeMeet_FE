import styled from 'styled-components'
import { UserClose } from '../assets'

interface DeleteProps {
  onClick: () => void
  top?: number
}

export const DeleteFriend = ({ onClick, top = 64 }: DeleteProps) => {
  return (
    <Container top={top}>
      <Content onClick={onClick}>
        <img src={UserClose} width={20} />
        <Title>친구 삭제</Title>
      </Content>
    </Container>
  )
}

const Container = styled.div<{ top: number }>`
  position: absolute;
  background-color: #fff;
  padding: 4px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  border-radius: 4px;
  height: fit-content;
  width: 130px;
  top: ${({ top }) => top}px;
  right: 0;
  z-index: 1;
  cursor: pointer;
`

const Content = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
  background: rgba(247, 92, 60, 0.2);
  border-radius: 4px;
  padding: 6px 4px;
`

const Title = styled.p`
  ${({ theme }) => theme.font.body6};
  color: ${({ theme }) => theme.color.orange400};
`
