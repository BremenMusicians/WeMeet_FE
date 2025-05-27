import styled from 'styled-components'
import { KeyboardEvent, useEffect, useRef, useState } from 'react'
import { ProfileCard } from '../components/ProfileCard'
import { Plus, More, Profile, PaperPlane, Search } from '../assets'
import { cookie } from '../utils/Auth'
import { useGetChatHistory } from '../apis/chat'
import { ChatListType, ReceiveMailFormat, SendMailFormat } from '../apis/chat/type'
import { useProfileStore } from '../stores/UserStores'
import { theme } from '../styles/Theme'
import { useGetMyFriendList } from '../apis/friends'
import useDebounce from '../hooks/useDebounce'
import { UserType } from '../apis/friends/type'

const BASE_URL = 'wemeet-prod.xquare.app'
const token = cookie.get('access_token')

function Chat() {
  const { profileInfo, setProfileInfo } = useProfileStore() // 선택한 친구의 프로필 정보
  const [chatList, setChatList] = useState<ChatListType[]>([]) // 친구 목록
  const [chatHistoryList, setChatHistoryList] = useState<ReceiveMailFormat[]>([]) // 선택한 친구와의 채팅 내역
  const [newChat, setNewChat] = useState<string>('') // 채팅 값
  const [selectedChatId, setSelectedChatId] = useState<string>('') // 선택된 상대의 chatId
  const [showMenu, setShowMenu] = useState<boolean>(false) // 케밥 메뉴
  const [searchKeyword, setSearchKeyword] = useState('')
  const [showList, setShowList] = useState<boolean>(true)
  const debouncedSearchText = useDebounce(searchKeyword, 300)
  const { data: friendData } = useGetMyFriendList(debouncedSearchText)

  const friendListRef = useRef<HTMLDivElement>(null)
  const bottomRef = useRef<HTMLDivElement>(null) // 채팅 화면 스크롤 하단 조정

  const handleClickOutside = (e: MouseEvent) => {
    const currentFriendListRef = friendListRef.current
    if (currentFriendListRef && !currentFriendListRef.contains(e.target as Node)) setShowList(false)
  }

  useEffect(() => {
    document.addEventListener('click', handleClickOutside)
    return () => document.removeEventListener('click', handleClickOutside)
  }, [friendListRef.current])

  useEffect(() => {
    if (bottomRef.current) bottomRef.current!.scrollTop = bottomRef.current!.scrollHeight
  }, [chatHistoryList]) // 채팅 목록이 변경된다면

  const wsRef = useRef<WebSocket | null>(null) // 웹소켓 설정

  const { data: chatHistoryData, refetch } = useGetChatHistory(profileInfo.chatId, profileInfo.chatId !== null)

  useEffect(() => {
    if (selectedChatId) {
      refetch() // chatId가 바뀔 때마다 강제로 refetch
    }
  }, [refetch, selectedChatId])

  useEffect(() => {
    if (!profileInfo.chatId) {
      setChatHistoryList([])
      return
    }

    if (chatHistoryData) {
      setChatHistoryList(chatHistoryData)
    }
  }, [chatHistoryData, profileInfo.chatId])

  // WebSocket 연결 설정
  useEffect(() => {
    const wsUrl = `wss://${BASE_URL}/ws/chat?token=${token}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('웹소켓 연결')
    }

    ws.onmessage = (event) => {
      const message = JSON.parse(event.data)
      if (message.type === 'MESSAGE') {
        // 메시지를 받았다면 채팅 내역에 추가
        setChatHistoryList((prev) => [...prev, message])
      } else if (message.type === 'UPDATE_CHAT_LIST') {
        // 채팅 리스트를 받았다면 채팅 리스트에 저장
        setChatList(message.chats)
      }
    }

    ws.onerror = (error) => {
      console.error('에러:', error)
    }

    ws.onclose = (e) => {
      console.log('웹소켓 연결 종료', e)
    }

    return () => {
      ws.close()
    }
  }, [])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewChat(event.target.value)
  }

  const mail = localStorage.getItem('mail') || ''

  const handleEnterPress = (e: KeyboardEvent) => {
    if (e.key == 'Enter') {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    // 채팅 내용이 없고 선택된 chatId가 없거나, 이메일이 없고 웹소켓 설정이 안되어있다면
    if (!newChat.trim() || !profileInfo?.mail || !wsRef.current) return

    // 보내는 형식
    const newMessage: SendMailFormat = {
      receiver: profileInfo.mail,
      content: newChat,
    }
    wsRef.current.send(JSON.stringify(newMessage))

    // 채팅 내역에 저장하는 형식
    const saveMessage: ReceiveMailFormat = {
      sender: mail,
      sendAt: new Date().toISOString(),
      content: newMessage.content,
    }

    setChatHistoryList((prev) => [...prev, saveMessage])
    setNewChat('')
  }

  return (
    <Container>
      <FriendListContainer>
        <FriendListTitle>
          <FriendNumber>{chatList.length}명의 친구</FriendNumber>
          <AddFriendSection ref={friendListRef}>
            <AddFriendButton onClick={() => setShowList((p) => !p)}>
              <Plus Fill={theme.color.gray300} />
            </AddFriendButton>
            {showList && (
              <ModalContainer>
                <ListSearchBox>
                  <img width={18} height={18} src={Search} />
                  <Input placeholder="이름 검색" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                </ListSearchBox>
                <ModalList>
                  <FriendListCount>{friendData?.pages[0]?.friendsCnt}명의 친구</FriendListCount>
                  {friendData?.pages
                    .flatMap((p) => p.friends)
                    .map((item: UserType) => (
                      <ProfileCard profileImg={item.profile || Profile} key={item.accountId} name={item.accountId} introduce={item.aboutMe} position={item.position} />
                    ))}
                </ModalList>
              </ModalContainer>
            )}
          </AddFriendSection>
        </FriendListTitle>
        <FriendList>
          {chatList.map((chat, index) => (
            <ProfileCardBox
              key={index}
              onClick={() => {
                setProfileInfo(chat)
                setSelectedChatId(chat.chatId)
              }}
            >
              <ProfileCard name={chat.accountId} introduce={chat.lastMessage || null} position={chat.position} profileImg={chat?.profile || Profile} />
            </ProfileCardBox>
          ))}
        </FriendList>
      </FriendListContainer>
      <ChatContainer>
        <ChatHeader>
          <ProfileInfo>
            <ProfileImage src={profileInfo?.profile || Profile} />
            <Nickname>{profileInfo?.accountId}</Nickname>
          </ProfileInfo>
          <KebabMenu onClick={() => setShowMenu(!showMenu)}>
            <More />
          </KebabMenu>
          {showMenu && <Dropdown>친구 삭제</Dropdown>}
        </ChatHeader>

        <ChatHistory ref={bottomRef}>
          {chatHistoryList.map((chat, index) => (
            <MessageWrapper key={index} isMine={chat.sender === mail}>
              <MessageBubble isMine={chat.sender === mail}>{chat.content}</MessageBubble>
              <MessageTime>
                {new Date(chat.sendAt).toLocaleTimeString('ko-KR', {
                  hour: '2-digit',
                  minute: '2-digit',
                  hour12: true,
                })}
              </MessageTime>
            </MessageWrapper>
          ))}
        </ChatHistory>

        <ChatInputBox>
          <InputBox>
            <EmojiButton>😊</EmojiButton>
            <Input onKeyDown={handleEnterPress} type="text" placeholder="메시지를 입력하세요" value={newChat} onChange={handleChange} />
            <SendButton disabled={!newChat.trim() || !profileInfo?.mail || !wsRef.current} onClick={handleSubmit}>
              <img src={PaperPlane} />
            </SendButton>
          </InputBox>
        </ChatInputBox>
      </ChatContainer>
    </Container>
  )
}

export default Chat

const FriendListCount = styled.p`
  color: ${({ theme }) => theme.color.gray400};
  ${({ theme }) => theme.font.body6}
  padding-left: 4px;
`

const ListSearchBox = styled.div`
  width: 100%;
  background-color: ${({ theme }) => theme.color.gray100};
  border-radius: 100px;
  padding: 8px 14px;
  display: flex;
  align-items: center;
  gap: 8px;
  &:focus-within {
    border: 1px solid ${({ theme }) => theme.color.gray400};
    background-color: white;
  }
  transition: 0.3s all;
`

const AddFriendSection = styled.div`
  position: relative;
`

const ModalContainer = styled.div`
  background-color: white;
  display: flex;
  flex-direction: column;
  z-index: 10;
  height: 400px;
  position: absolute;
  padding: 8px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  border-radius: 12px;
  gap: 16px;
`

const ModalList = styled.div`
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;
  overflow-y: scroll;
`

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

const AddFriendButton = styled.button`
  background-color: transparent;
  cursor: pointer;
  position: relative;
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

const InputBox = styled.div`
  width: 100%;
  display: flex;
  background-color: white;
  padding: 4px 4px 4px 16px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  gap: 8px;
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
  align-items: end;
  flex-direction: ${({ isMine }) => (isMine ? 'row-reverse' : 'row')};
  gap: 8px;
`

const MessageBubble = styled.div<{ isMine: boolean }>`
  padding: 10px 14px;
  border-radius: 20px;
  max-width: 60%;
  ${({ theme }) => theme.font.body3}
  ${({ isMine, theme }) =>
    isMine
      ? `background-color: ${theme.color.orange400};
  color: #fff;
  border-radius: 24px 0 24px 24px;`
      : `background-color: ${theme.color.gray100};
  color: ${theme.color.gray950};
  border-radius: 0 24px 24px;
  border: 1px solid ${theme.color.gray200}`}
`

const MessageTime = styled.div`
  font-size: 10px;
  color: ${({ theme }) => theme.color.gray300};
  ${({ theme }) => theme.font.body6}
`

const ChatInputBox = styled.div`
  display: flex;
  align-items: center;
  padding: 0px 16px 12px;
  gap: 12px;
  background-color: ${({ theme }) => theme.color.gray50};
`

const Input = styled.input`
  flex: 1;
  background-color: transparent;
  &::placeholder {
    color: ${({ theme }) => theme.color.gray400};
  }
  ${({ theme }) => theme.font.body3};
`

const SendButton = styled.button`
  background-color: ${({ theme }) => theme.color.orange500};
  color: white;
  padding: 12px;
  border-radius: 12px;
  ${({ theme }) => theme.font.body3};
  cursor: pointer;
  display: flex;
  &:disabled {
    background-color: ${({ theme }) => theme.color.gray200};
    svg {
      fill: ${({ theme }) => theme.color.gray300};
    }
  }
`

const EmojiButton = styled.button`
  background-color: transparent;
  cursor: pointer;
  ${({ theme }) => theme.font.title1}
`
