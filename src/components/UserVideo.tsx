import styled from 'styled-components'
import { LogOut, More, Warning } from '../assets'
import { useState } from 'react'

interface UserVideoProps {
  owner?: boolean
  accountId: string
  onClick: () => void
  img: string
}

export const UserVideo = ({ owner = false, accountId, onClick, img }: UserVideoProps) => {
  const [more, setMore] = useState<boolean>(false)

  return (
    <Container userImg={img} onClick={() => setMore(false)}>
      <NickNameContainer>
        {!!owner && (
          <MoreButton
            onClick={(e) => {
              e.stopPropagation()
              setMore(!more)
            }}
          >
            <More Fill="#ffffff" />
          </MoreButton>
        )}
        {more && (
          <Option onClick={(e) => e.stopPropagation()}>
            <OptionContent>
              <img width={20} src={Warning} alt="신고" /> <p>신고하기</p>
            </OptionContent>
            <OptionContent
              onClick={(e) => {
                e.stopPropagation()
                onClick()
              }}
            >
              <LogOut width={20} Fill="#A1A1AA" /> <p>내보내기</p>
            </OptionContent>
          </Option>
        )}
        <NickName>{accountId}</NickName>
      </NickNameContainer>
    </Container>
  )
}

const MoreButton = styled.div`
  padding: 0px 6px;
  background: rgba(0, 0, 0, 0.4);
  border-radius: 6px;
  width: 36px;
  height: 36px;
  display: flex;
  justify-content: center;
  align-items: center;
  cursor: pointer;
  position: absolute;
  top: 16px;
  right: 16px;
`

const Container = styled.div<{ userImg: string }>`
  position: relative;
  width: 100%;
  height: 100%;
  border-radius: 16px;
  background-color: gray;
  background-image: ${({ userImg }) => `url(${userImg})`};
  max-width: 560px;
`

const OptionContent = styled.button`
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 6px 4px;
  ${({ theme }) => theme.font.body6}
  background: none;
  color: white;
  cursor: pointer;
`

const Option = styled.div`
  display: flex;
  flex-direction: column;
  position: absolute;
  border-radius: 8px;
  background: rgba(0, 0, 0, 0.8);
  color: #fff;
  padding: 4px;
  gap: 2px;
  top: 64px;
  right: 16px;
  cursor: pointer;
`

const NickNameContainer = styled.div`
  display: flex;
  padding: 16px;
  align-items: end;
  width: 100%;
  height: 100%;
  position: relative;
`

const NickName = styled.p`
  width: fit-content;
  white-space: nowrap;
  height: fit-content;
  border-radius: 6px;
  background: rgba(0, 0, 0, 0.4);
  padding: 6px 10px;
  color: #fff;
`
