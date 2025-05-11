import styled from 'styled-components'
import { useEffect, useRef, useState } from 'react'
import { ProfileCard } from '../components/ProfileCard'
import { Plus, More } from '../assets'
import { cookie } from '../utils/Auth'
import { useGetChatHistory } from '../apis/chat'
import { useSearchParams } from 'react-router-dom'
import { ChatListType, ReceiveMailFormat } from '../apis/chat/type'

const BASE_URL = 'wemeet-prod.xquare.app'
const token = cookie.get('access_token')

function Chat() {
  const [searchParams] = useSearchParams()
  const friendId = searchParams.get('id')
  const [chatList, setChatList] = useState<ChatListType[]>([]) // 친구 목록
  const [chatHistoryList, setChatHistoryList] = useState<ReceiveMailFormat[]>([]) // 선택된 친구의 메시지 목록
  const [newChat, setNewChat] = useState<string>('')
  const [selectedChatId, setSelectedChatId] = useState<string | null>(null) // 선택된 상대의 chatId
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [chatHistoryList])

  const { data: chatHistory } = useGetChatHistory('8643a4ce-df74-47fa-884c-f36e7c236154')
  const wsRef = useRef<WebSocket | null>(null)

  useEffect(() => {
    if (selectedChatId) {
      // 선택된 상대의 채팅 기록을 로딩
      setChatList(chatHistory || [])
    }
  }, [selectedChatId, chatHistory])

  // WebSocket 연결 설정
  useEffect(() => {
    const wsUrl = `wss://${BASE_URL}/ws/chat?token=${token}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('웹소켓 연결')
      ws.send(JSON.stringify({ type: 'CONNECT', token }))
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'MESSAGE') {
        setChatHistoryList((prev) => [...prev, message])
      } else if (message.type === 'UPDATE_CHAT_LIST') {
        setChatList(message.chats)
      }
    }

    ws.onerror = (error) => {
      console.error('에러:', error)
    }

    ws.onclose = (e) => {
      console.log('웹소켓 연결 종료', e.code, e.reason)
    }

    return () => {
      ws.close()
    }
  }, [])

  useEffect(() => {
    if (selectedChatId) {
      setChatHistoryList(chatHistory || [])
    }
  }, [selectedChatId, chatHistory])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewChat(event.target.value)
  }

  const handleSubmit = () => {
    console.log('클릭은 됨', chatHistory, chatHistoryList)
    if (!newChat.trim() || !selectedChatId || !wsRef.current) return

    const newMessage = {
      receiver: selectedChatId,
      content: newChat,
    }

    wsRef.current.send(JSON.stringify(newMessage))

    setChatHistoryList((prev) => [
      ...prev,
      {
        sender: 'ojinikim@dsm.hs.kr',
        content: newChat,
        sendAt: new Date().toISOString(),
      },
    ])
    setNewChat('')
  }

  return (
    <Container>
      <FriendListContainer>
        <FriendListTitle>
          <FriendNumber>{chatList.length}명의 친구</FriendNumber>
          <AddFriendButton src={Plus} />
        </FriendListTitle>
        <FriendList>
          {chatList.map((chat, index) => (
            <ProfileCardBox key={index} onClick={() => setSelectedChatId(chat.chatId)}>
              <ProfileCard name={chat.accountId} introduce={chat.lastMessage || null} position={chat.position} profileImg={chat.profile} children={undefined} />
            </ProfileCardBox>
          ))}
        </FriendList>
      </FriendListContainer>
      <ChatContainer>
        <ChatHeader>
          <ProfileInfo>
            <ProfileImage src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQFE_Ji1JNjge_DWCchd-bInvunXDDK_qe0ow&s" />
            <div>
              <Nickname>{friendId}</Nickname>
              <PositionList>FE Developer</PositionList>
            </div>
          </ProfileInfo>
          <KebabMenu onClick={() => setShowMenu(!showMenu)}>
            <More />
          </KebabMenu>
          {showMenu && <Dropdown>친구 삭제</Dropdown>}
        </ChatHeader>

        <ChatHistory ref={bottomRef}>
          {chatHistory?.map((chat, index) => (
            <MessageWrapper key={index} isMine={chat.sender === 'ojinikim@dsm.hs.kr'}>
              <MessageBubble isMine={chat.sender === 'ojinikim@dsm.hs.kr'}>{chat.content}</MessageBubble>
              <MessageTime>{new Date(chat.sendAt).toLocaleTimeString()}</MessageTime>
            </MessageWrapper>
          ))}
        </ChatHistory>

        <ChatInputBox>
          <EmojiButton>😊</EmojiButton>
          <Input type="text" placeholder="메시지를 입력하세요..." value={newChat} onChange={handleChange} />
          <SendButton onClick={handleSubmit}>전송</SendButton>
        </ChatInputBox>
      </ChatContainer>
    </Container>
  )
}

export default Chat

// 스타일 컴포넌트들 (이전과 동일)

const ChatContainer = styled.div`
  width: 100%;
  height: 100%;
  border: 1px solid ${({ theme }) => theme.color.gray100};
  display: flex;
  flex-direction: column;
`

const Container = styled.div`
  max-width: 1280px;
  width: 100%;
  height: 100vh;
  padding: 70px 24px 0;
  justify-self: center;
  display: flex;
`

const FriendListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 0 0;
  gap: 20px;
  width: 360px;
  height: 100%;
`

const FriendListTitle = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  padding: 0 16px;
`

const FriendNumber = styled.p`
  color: ${({ theme }) => theme.color.gray400};
  ${({ theme }) => theme.font.body3}
`

const AddFriendButton = styled.img`
  cursor: pointer;
`

const FriendList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`

const ProfileCardBox = styled.div`
  padding: 8px;
  width: 100%;
  display: flex;
  &:hover {
    background-color: ${({ theme }) => theme.color.gray50};
  }
`

const ChatHeader = styled.div`
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 16px;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray100};
`

const ProfileInfo = styled.div`
  display: flex;
  align-items: center;
  gap: 12px;
`

const ProfileImage = styled.img`
  width: 40px;
  height: 40px;
  border-radius: 100%;
`

const Nickname = styled.p`
  ${({ theme }) => theme.font.body2};
`

const PositionList = styled.p`
  color: ${({ theme }) => theme.color.gray400};
  ${({ theme }) => theme.font.body3}
`

const KebabMenu = styled.button`
  cursor: pointer;
`

const Dropdown = styled.div`
  position: absolute;
  top: 60px;
  right: 24px;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  font-size: 14px;
  cursor: pointer;
`

const ChatHistory = styled.div`
  flex: 1;
  padding: 16px;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 12px;
  height: 100%;
  background-color: ${({ theme }) => theme.color.gray50};
`

const MessageWrapper = styled.div<{ isMine: boolean }>`
  display: flex;
  flex-direction: column;
  align-items: ${({ isMine }) => (isMine ? 'flex-end' : 'flex-start')};
  gap: 4px;
`

const MessageBubble = styled.div<{ isMine: boolean }>`
  background-color: ${({ isMine, theme }) => (isMine ? theme.color.orange500 : theme.color.gray50)};
  color: ${({ isMine, theme }) => (isMine ? 'white' : theme.color.gray900)};
  padding: 10px 14px;
  border-radius: 20px;
  max-width: 60%;
  ${({ theme }) => theme.font.body3}
`

const MessageTime = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.color.gray300};
`

const ChatInputBox = styled.div`
  border-top: 1px solid ${({ theme }) => theme.color.gray100};
  display: flex;
  align-items: center;
  padding: 12px 16px;
  gap: 12px;
`

const Input = styled.input`
  flex: 1;
  padding: 8px 12px;
  border-radius: 20px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  ${({ theme }) => theme.font.body3};
`

const SendButton = styled.button`
  background-color: ${({ theme }) => theme.color.orange500};
  color: white;
  padding: 6px 12px;
  border-radius: 16px;
  ${({ theme }) => theme.font.body3};
  cursor: pointer;
`

const EmojiButton = styled.button`
  font-size: 18px;
  background: none;
  border: none;
  cursor: pointer;
`
