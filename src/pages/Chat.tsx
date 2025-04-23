import { useEffect, useRef, useState } from 'react'
import styled from 'styled-components'
import { ProfileCard } from '../components/ProfileCard'
import { Emoji, More, PaperPlane } from '../assets'
import { DeleteFriend } from '../components/DeleteFriend'
import { useGetChatHistory, useGetChatList } from '../apis/chat'
import data from '@emoji-mart/data'
import Picker from '@emoji-mart/react'
import { ChatListType } from '../apis/chat/type'
import { positionEnum } from '../apis/user/type'

const BASEURL = import.meta.env.VITE_SERVER_BASE_URL
const WS_URL = `wss://${BASEURL}/ws/chat`

function Chat() {
  const [showPicker, setShowPicker] = useState(false)
  const [socket, setSocket] = useState<WebSocket | null>(null)
  const [messages, setMessages] = useState<any[]>([])
  const [inputValue, setInputValue] = useState('')
  const [isOpen, setIsOpen] = useState(false)
  const pickerRef = useRef<HTMLDivElement>(null)
  const buttonRef = useRef<HTMLButtonElement>(null)
  const contextpickerRef = useRef<HTMLDivElement>(null)
  const scrollRef = useRef<HTMLDivElement>(null)
  const [selectedFriend, setSelectedFriend] = useState<ChatListType>({
    chatId: '',
    accountId: '',
    profile: null,
    position: [],
  })

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      const target = e.target as Node
      if (pickerRef.current && !pickerRef.current.contains(target) && buttonRef.current && !buttonRef.current.contains(target)) {
        setShowPicker(false)
      }
      if (contextpickerRef.current && !contextpickerRef.current.contains(target)) {
        setIsOpen(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    // if (selectedFriend.chatId) useGetChatHistory(selectedFriend.chatId)
  }, [selectedFriend.chatId])

  useEffect(() => {
    const ws = new WebSocket(WS_URL)
    setSocket(ws)

    ws.onopen = () => console.log('웹소켓 연결됨')
    ws.onmessage = (e) => setMessages((prev) => [...prev, JSON.parse(e.data)])
    ws.onclose = () => console.log('웹소켓 연결 종료')

    return () => ws.close()
  }, [])

  useEffect(() => {
    if (scrollRef.current) scrollRef.current.scrollTop = scrollRef.current.scrollHeight
  }, [messages])

  const handleSendMessage = () => {
    if (!inputValue.trim()) return

    const messagePayload = {
      name: '나',
      message: inputValue,
      time: new Date().toLocaleString(),
    }

    socket?.send(JSON.stringify(messagePayload))
    setMessages((prev) => [...prev, messagePayload])
    setInputValue('')
  }

  const enterKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') handleSendMessage()
  }

  const timeFormatting = (date: string) => {
    const [weekday, month, day, year, time] = date.split(' ')
    return `${year} ${time.split(':').slice(0, 2).join(':')}`
  }

  const handleClickProfile = (item: ChatListType) => {
    setSelectedFriend(item)
  }

  const chatList: ChatListType[] = [
    {
      chatId: 'chat-1',
      accountId: '락 안듣는사람이 먼저',
      profile: null,
      position: ['VOCAL', 'SYNTH', 'GUITAR'],
      lastMessage: '밥먹으러 가자!',
    },
    {
      chatId: 'chat-2',
      accountId: '락 안듣는사람',
      profile: null,
      position: ['VOCAL'],
      lastMessage: '밥먹으러 가자!',
    },
  ]

  return (
    <Layout>
      <Container>
        <FriendListBox>
          <FriendNumber>{chatList.length}명의 친구</FriendNumber>
          <FriendList>
            {chatList.map((item) => (
              <ProfileBox key={item.chatId} onClick={() => handleClickProfile(item)}>
                <ProfileCard name={item.accountId} introduce={item.lastMessage || ''} position={item.position} children={undefined} />
              </ProfileBox>
            ))}
          </FriendList>
        </FriendListBox>

        {selectedFriend.chatId && (
          <ChatBox>
            <TopBar>
              <UserInfo>
                <UserProfileImage />
                <UserNicknameBox>
                  <UserNickname>{selectedFriend.accountId}</UserNickname>
                  {selectedFriend.position.map((p) => (
                    <UserTag key={p}>{positionEnum[p]}</UserTag>
                  ))}
                </UserNicknameBox>
              </UserInfo>
              <ContextMenu ref={contextpickerRef}>
                <More onClick={() => setIsOpen((prev) => !prev)} width={24} />
                {isOpen && <DeleteFriend top={28} onClick={() => setIsOpen(false)} />}
              </ContextMenu>
            </TopBar>

            <ChatScreen ref={scrollRef}>
              {messages.map((item, idx) =>
                item.name === '상대방' ? (
                  <PartnerChatBox key={idx}>
                    <PartnerChat>{item.message}</PartnerChat>
                    <Time>{timeFormatting(item.time)}</Time>
                  </PartnerChatBox>
                ) : (
                  <UserChatBox key={idx}>
                    <Time>{timeFormatting(item.time)}</Time>
                    <UserChat>{item.message}</UserChat>
                  </UserChatBox>
                ),
              )}
            </ChatScreen>

            <InputBox>
              <InputField>
                <PickerBox ref={pickerRef}>{showPicker && <Picker theme="light" data={data} onEmojiSelect={(e: any) => setInputValue((prev) => prev + e.native)} />}</PickerBox>
                <EmojiButton ref={buttonRef} onClick={() => setShowPicker((prev) => !prev)}>
                  <Icon src={Emoji} alt="emoji" />
                </EmojiButton>
                <Input autoFocus placeholder="메시지 입력" value={inputValue} onChange={(e) => setInputValue(e.target.value)} onKeyDown={enterKeyDown} />
              </InputField>
              <SendButton onClick={handleSendMessage}>
                <Icon src={PaperPlane} alt="send" />
              </SendButton>
            </InputBox>
          </ChatBox>
        )}
      </Container>
    </Layout>
  )
}

// styled-components 생략하지 않고 유지
// ... (styled-components 정의는 원본과 동일하게 유지되며 생략함)

export default Chat

const PickerBox = styled.div`
  position: absolute;
  bottom: 56px;
  left: 0;
`

const EmojiButton = styled.button`
  display: flex;
  padding: 8px;
  background-color: transparent;
`

const Input = styled.input`
  ${({ theme }) => theme.font.body3}
  &::placeholder {
    color: ${({ theme }) => theme.color.gray300};
  }
  &:focus {
    border-color: ${({ theme }) => theme.color.gray800};
  }
  width: 100%;
  padding: 16px 0;
  border-radius: 100px;
`

const InputField = styled.div`
  position: relative;
  width: 100%;
  background-color: #fff;
  border: 1px solid ${({ theme }) => theme.color.gray300};
  height: 48px;
  border-radius: 100px;
  padding: 0 4px;
  display: flex;
  gap: 4px;
`

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
  padding: 24px 16px;
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
  width: 100%;
  display: flex;
  align-items: center;
  gap: 12px;
  padding: 8px 24px 24px;
  background-color: ${({ theme }) => theme.color.gray50};
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
