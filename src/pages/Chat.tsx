import React, { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ProfileCard } from '../components/ProfileCard'
import { More, PaperPlane } from '../assets'
import { DeleteFriend } from '../components/DeleteFriend'

function Chat() {
  const [isOpen, setIsOpen] = useState(false)
  const contextMenuRef = useRef<HTMLDivElement>(null)

  const handleSendMessage = () => {
    // 채팅 전송
  }

  const toggleMenu = () => {
    setIsOpen((prev) => !prev)
  }

  const handleClickOutside = (event: MouseEvent) => {
    if (contextMenuRef.current && !contextMenuRef.current.contains(event.target as Node)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  const timeFormatting = (date: string) => {
    const [, time] = date.split(' ')
    const [hour, minute] = time.split(':').map(Number)
    return `${hour >= 12 ? '오후' : '오전'} ${hour === 12 ? 12 : hour % 12}:${minute}`
  }

  const data = [
    { id: 1, name: '박수현', introduce: '어쩔ㄹㄹㄹ', position: ['신스'], status: 'not' },
    { id: 2, name: '박수현', introduce: '어쩔ㄹㄹㄹ', position: ['신스'], status: 'standby' },
    { id: 3, name: '박수현', introduce: '어쩔ㄹㄹㄹ', position: ['신스'], status: 'not' },
  ]
  const chatMessages = [
    {
      id: 1,
      name: '햄',
      time: '2025-03-20 14:30',
      message: '안녕! 오늘 뭐 하고 지냈어?',
    },
    {
      id: 2,
      name: '상대방',
      time: '2025-03-20 14:32',
      message: '오, 그냥 일 좀 하고 있었어. 너는?',
    },
    {
      id: 3,
      name: '햄',
      time: '2025-03-20 14:35',
      message: '나도 이것저것 작업하고 있었지! 요즘 바쁘다 ㅋㅋ',
    },
  ]

  return (
    <Layout>
      <Container>
        <FriendListBox>
          <FriendNumber>45명의 친구</FriendNumber>
          <FriendList>
            {data.map((item) => (
              <ProfileBox key={item.id}>
                <ProfileCard name={item.name} introduce={item.introduce} position={item.position} children={null} />
              </ProfileBox>
            ))}
          </FriendList>
        </FriendListBox>

        <ChatBox>
          <TopBar>
            <UserInfo>
              <UserProfileImage />
              <UserNicknameBox>
                <UserNickname>어쩌고</UserNickname>
                <UserTag>기타</UserTag>
              </UserNicknameBox>
            </UserInfo>
            <ContextMenu ref={contextMenuRef}>
              <More onClick={toggleMenu} width={24} />
              {isOpen && <DeleteFriend top={28} onClick={() => setIsOpen(false)} />}
            </ContextMenu>
          </TopBar>

          <ChatScreen>
            {chatMessages.map((item) =>
              name === '상대방' ? (
                <PartnerChatBox key={item.id}>
                  <PartnerChat>{item.message}</PartnerChat>
                  <Time>{timeFormatting(item.time)}</Time>
                </PartnerChatBox>
              ) : (
                <UserChatBox key={item.id}>
                  <Time>{timeFormatting(item.time)}</Time>
                  <UserChat>{item.message}</UserChat>
                </UserChatBox>
              ),
            )}
          </ChatScreen>
          <InputBox>
            <Input placeholder="메시지 입력" />
            <SendButton onClick={handleSendMessage}>
              <Icon src={PaperPlane} />
            </SendButton>
          </InputBox>
        </ChatBox>
      </Container>
    </Layout>
  )
}

const ContextMenu = styled.div`
  position: relative;
`

const FriendListBox = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 0px;
  gap: 20px;
  min-width: 240px;
  width: 370px;
`

const Layout = styled.div`
  width: 100%;
  display: flex;
  justify-content: center;
`

const Container = styled.div`
  width: 100%;
  max-width: 1280px;
  height: 100vh;
  display: flex;
  padding-top: 70px;
`

const FriendNumber = styled.div`
  padding-left: 20px;
  color: ${({ theme }) => theme.color.gray400};
  ${({ theme }) => theme.font.body3}
`

const FriendList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
`

const ProfileBox = styled.div`
  display: flex;
  padding: 8px 24px;
  &:hover {
    background-color: ${({ theme }) => theme.color.gray50};
  }
`

const ChatBox = styled.div`
  display: flex;
  flex-direction: column;
  border-left: 1px solid ${({ theme }) => theme.color.gray200};
  position: relative;
  min-width: 200px;
  max-width: 860px;
  width: 100%;
  will-change: width;
`

const TopBar = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  padding: 24px 16px 16px;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
  align-items: center;
`

const UserInfo = styled.div`
  display: flex;
  gap: 16px;
  align-items: center;
`

const UserProfileImage = styled.div`
  width: 48px;
  height: 48px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
`

const UserNicknameBox = styled.div`
  display: flex;
  align-items: center;
  gap: 8px;
`

const UserNickname = styled.p`
  ${({ theme }) => theme.font.title3}
`

const UserTag = styled.div`
  display: flex;
  padding: 4px 8px;
  border-radius: 4px;
  background-color: ${({ theme }) => theme.color.gray50};
  border: 1px solid ${({ theme }) => theme.color.gray200};
  color: ${({ theme }) => theme.color.gray400};
  ${({ theme }) => theme.font.body5};
`

const Icon = styled.img`
  cursor: pointer;
`

const ChatScreen = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  padding: 24px 36px 36px;
  background-color: ${({ theme }) => theme.color.gray50};
  height: 100%;
  position: relative;
  overflow-y: auto;
`

const PartnerChatBox = styled.div`
  width: 100%;
  display: flex;
  align-items: end;
  gap: 8px;
`
const PartnerChat = styled.div`
  max-width: 300px;
  padding: 12px 20px;
  display: flex;
  background-color: ${({ theme }) => theme.color.gray100};
  border: 1px solid ${({ theme }) => theme.color.gray200};
  border-radius: 0 24px 24px;
  ${({ theme }) => theme.font.body4}
`

const UserChatBox = styled.div`
  width: 100%;
  justify-content: end;
  align-items: end;
  gap: 8px;
  display: flex;
`

const UserChat = styled.div`
  max-width: 300px;
  padding: 12px 20px;
  display: flex;
  background-color: ${({ theme }) => theme.color.orange400};
  color: #fff;
  border-radius: 24px 0 24px 24px;
  ${({ theme }) => theme.font.body4}
`

const Time = styled.p`
  color: ${({ theme }) => theme.color.gray400};
  ${({ theme }) => theme.font.body6}
`

const InputBox = styled.div`
  position: absolute;
  bottom: 36px;
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  z-index: 10;
  padding: 0 24px;
`

const Input = styled.input`
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.color.gray300};
  height: 48px;
  border-radius: 100px;
  padding: 16px 20px;
  ${({ theme }) => theme.font.body3}
  &::placeholder {
    color: ${({ theme }) => theme.color.gray300};
  }
  &:focus {
    border-color: ${({ theme }) => theme.color.gray800};
  }
  width: 100%;
`

const SendButton = styled.button`
  padding: 12px;
  border-radius: 100px;
  background-color: ${({ theme }) => theme.color.orange400};
  display: flex;
  justify-content: center;
  align-items: center;
  &:hover {
    background-color: ${({ theme }) => theme.color.orange500};
  }
`

export default Chat
