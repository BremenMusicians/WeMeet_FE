import type React from 'react'
import styled from 'styled-components'
import { type KeyboardEvent, useCallback, useEffect, useRef, useState } from 'react'
import { ProfileCard } from '../components/ProfileCard'
import { Plus, More, Profile, PaperPlane, Search, Emoji } from '../assets'
import { cookie } from '../utils/Auth'
import { useGetChatHistory } from '../apis/chat'
import type { ChatListType, ChatUserProfile, ReceiveMailFormat, SendMailFormat } from '../apis/chat/type'
import { useProfileStore } from '../stores/UserStores'
import { theme } from '../styles/Theme'
import { useDeleteFriend, useGetMyFriendList } from '../apis/friends'
import useDebounce from '../hooks/useDebounce'
import type { UserType } from '../apis/friends/type'
import Picker from '@emoji-mart/react'
import { useClickOutside } from '../hooks/useClickOutside'

const BASE_URL = import.meta.env.VITE_WS_BASE_URL

function Chat() {
  const token = cookie.get('access_token')
  const { profileInfo, setProfileInfo } = useProfileStore()
  const [chatList, setChatList] = useState<ChatListType[]>([])
  const [chatHistoryList, setChatHistoryList] = useState<ReceiveMailFormat[]>([])
  const [newChat, setNewChat] = useState<string>('')
  const [selectedChatId, setSelectedChatId] = useState<string>('')
  const [searchKeyword, setSearchKeyword] = useState('')

  // WebSocket 연결 상태 관리
  const [isConnected, setIsConnected] = useState(false)
  const [reconnectAttempts, setReconnectAttempts] = useState(0)
  const maxReconnectAttempts = 5

  const debouncedSearchText = useDebounce(searchKeyword, 300)
  const { data: friendData } = useGetMyFriendList(debouncedSearchText)

  const { mutate: deleteFriend } = useDeleteFriend({
    onSuccess: () => {
      refetch()
      if (profileInfo.chatId === selectedChatId) {
        setProfileInfo({} as ChatUserProfile)
        setChatHistoryList([])
        setSelectedChatId('')
      }
    },
  })

  const handleDeleteFriend = (accountId: string) => {
    const result = confirm('선택한 친구를 삭제하시겠습니까?')
    if (result) deleteFriend(accountId)
  }

  // 기존 ref들
  const emojiPickerRef = useRef<HTMLDivElement>(null)
  const [showEmojiPicker, setShowEmojiPicker] = useState(false)
  const friendListRef = useRef<HTMLDivElement>(null)
  const [showList, setShowList] = useState<boolean>(false)
  const moreMenuRef = useRef<HTMLDivElement>(null)
  const [showMenu, setShowMenu] = useState<boolean>(false)
  const bottomRef = useRef<HTMLDivElement>(null)
  const wsRef = useRef<WebSocket | null>(null)

  // 클릭 아웃사이드 훅들
  useClickOutside(
    emojiPickerRef,
    useCallback(() => {
      if (showEmojiPicker) setShowEmojiPicker(false)
    }, [showEmojiPicker]),
  )

  useClickOutside(
    friendListRef,
    useCallback(() => {
      if (showList) setShowList(false)
    }, [showList]),
  )

  useClickOutside(
    moreMenuRef,
    useCallback(() => {
      if (showMenu) setShowMenu(false)
    }, [showMenu]),
  )

  const { data: chatHistoryData, refetch } = useGetChatHistory(profileInfo.chatId, profileInfo.chatId !== null)

  // 채팅 히스토리 스크롤 조정
  useEffect(() => {
    if (bottomRef.current) {
      bottomRef.current.scrollTop = bottomRef.current.scrollHeight
    }
  }, [chatHistoryList])

  // 선택된 채팅 ID 변경 시 refetch
  useEffect(() => {
    if (selectedChatId) {
      refetch()
    }
  }, [refetch, selectedChatId])

  // 채팅 히스토리 데이터 업데이트
  useEffect(() => {
    if (!profileInfo.chatId) {
      setChatHistoryList([])
      return
    }
    if (chatHistoryData) setChatHistoryList(chatHistoryData)
  }, [chatHistoryData, profileInfo.chatId])

  // WebSocket 연결 함수
  const connectWebSocket = useCallback(() => {
    if (!token) {
      console.error('토큰이 없습니다.')
      return
    }

    // 기존 연결이 있다면 정리
    if (wsRef.current) {
      wsRef.current.close()
      wsRef.current = null
    }

    const wsUrl = `wss://${BASE_URL}/ws/chat?token=${token}`
    const ws = new WebSocket(wsUrl)
    wsRef.current = ws

    ws.onopen = () => {
      console.log('웹소켓 연결 성공')
      setIsConnected(true)
      setReconnectAttempts(0)
    }

    ws.onmessage = (event) => {
      try {
        const message = JSON.parse(event.data)
        console.log('수신된 메시지:', message)

        if (message.type === 'UPDATE_CHAT_LIST') {
          setChatList(message.chats)
        }

        if (message.type === 'MESSAGE') {
          setChatHistoryList((prev) => [...prev, message])
        }
      } catch (error) {
        console.error('메시지 파싱 오류:', error)
      }
    }

    ws.onerror = (error) => {
      console.error('웹소켓 오류:', error)
      setIsConnected(false)
    }

    ws.onclose = (e) => {
      console.log('웹소켓 연결 종료:', e.code, e.reason)
      setIsConnected(false)

      // 비정상 종료인 경우 재연결 시도
      if (e.code !== 1000 && reconnectAttempts < maxReconnectAttempts) {
        setTimeout(() => {
          console.log(`재연결 시도 ${reconnectAttempts + 1}/${maxReconnectAttempts}`)
          setReconnectAttempts((prev) => prev + 1)
          connectWebSocket()
        }, 3000 * (reconnectAttempts + 1)) // 지수 백오프
      }
    }
  }, [token, reconnectAttempts])

  // 컴포넌트 마운트 및 토큰 변경 시 WebSocket 연결
  useEffect(() => {
    connectWebSocket()

    return () => {
      if (wsRef.current) {
        wsRef.current.close()
        wsRef.current = null
      }
    }
  }, [connectWebSocket])

  // 페이지 포커스 시 연결 상태 확인 및 재연결
  useEffect(() => {
    const handleFocus = () => {
      if (!isConnected && wsRef.current?.readyState !== WebSocket.CONNECTING) {
        console.log('페이지 포커스 시 재연결 시도')
        connectWebSocket()
      }
    }

    const handleVisibilityChange = () => {
      if (!document.hidden && !isConnected) {
        console.log('페이지 가시성 변경 시 재연결 시도')
        connectWebSocket()
      }
    }

    window.addEventListener('focus', handleFocus)
    document.addEventListener('visibilitychange', handleVisibilityChange)

    return () => {
      window.removeEventListener('focus', handleFocus)
      document.removeEventListener('visibilitychange', handleVisibilityChange)
    }
  }, [isConnected, connectWebSocket])

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setNewChat(event.target.value)
  }

  const mail = localStorage.getItem('mail') || ''

  const handleEnterPress = (e: KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSubmit()
    }
  }

  const handleSubmit = () => {
    if (!newChat.trim() || !profileInfo?.mail || !wsRef.current || !isConnected) {
      if (!isConnected) {
        console.log('WebSocket 연결이 끊어져 있습니다. 재연결을 시도합니다.')
        connectWebSocket()
      }
      return
    }

    const newMessage: SendMailFormat = {
      receiver: profileInfo.mail,
      content: newChat,
    }

    try {
      wsRef.current.send(JSON.stringify(newMessage))

      const saveMessage: ReceiveMailFormat = {
        sender: mail,
        sendAt: new Date().toISOString(),
        content: newMessage.content,
      }

      setChatHistoryList((prev) => [...prev, saveMessage])
      setNewChat('')
    } catch (error) {
      console.error('메시지 전송 오류:', error)
      connectWebSocket() // 전송 실패 시 재연결 시도
    }
  }

  const handleNewChat = (item: UserType) => {
    setProfileInfo(item)
    setSelectedChatId(item.chatId)
    setShowList(false)
  }

  return (
    <Container>
      <FriendListContainer>
        <FriendListTitle>
          <FriendNumber>{chatList.length}명의 친구</FriendNumber>
          <AddFriendSection ref={friendListRef}>
            <Button onClick={() => setShowList((p) => !p)}>
              <Plus Fill={theme.color.gray300} />
            </Button>
            {showList && (
              <ModalContainer>
                <ListSearchContainer>
                  <ListSearchBox>
                    <img width={18} height={18} src={Search || '/placeholder.svg'} />
                    <Input placeholder="이름 검색" value={searchKeyword} onChange={(e) => setSearchKeyword(e.target.value)} />
                  </ListSearchBox>
                </ListSearchContainer>
                <ModalList>
                  <FriendListCount>{friendData?.pages[0]?.friendsCnt || 0}명의 친구</FriendListCount>
                  {friendData?.pages
                    .flatMap((p) => p.friends)
                    .map((item: UserType) => (
                      <ProfileCardBox key={item.mail} onClick={() => handleNewChat(item)}>
                        <ProfileCard profileImg={item.profile || Profile} key={item.accountId} name={item.accountId} introduce={item.aboutMe} position={item.position} />
                      </ProfileCardBox>
                    ))}
                </ModalList>
              </ModalContainer>
            )}
          </AddFriendSection>
        </FriendListTitle>

        <FriendList>
          {chatList === null ? (
            <div style={{ padding: '1rem' }}>채팅 리스트 불러오는 중...</div>
          ) : (
            chatList.map((chat, index) => (
              <ProfileCardBox
                key={index}
                onClick={() => {
                  setProfileInfo(chat)
                  setSelectedChatId(chat.chatId)
                }}
              >
                <ProfileCard name={chat.accountId} introduce={chat.lastMessage || null} position={chat.position} profileImg={chat?.profile || Profile} />
              </ProfileCardBox>
            ))
          )}
        </FriendList>
      </FriendListContainer>

      <ChatContainer>
        <ChatHeader>
          <ProfileInfo>
            <ProfileImage src={profileInfo?.profile || Profile} />
            <Nickname>{profileInfo?.accountId}</Nickname>
          </ProfileInfo>
          <Section>
            <Button onClick={() => setShowMenu(!showMenu)}>
              <More Fill={theme.color.gray400} />
            </Button>
            {showMenu && (
              <Dropdown ref={moreMenuRef}>
                <DropdownItem onClick={() => handleDeleteFriend(profileInfo.accountId)}>친구 삭제</DropdownItem>
              </Dropdown>
            )}
          </Section>
        </ChatHeader>

        <ChatHistory ref={bottomRef}>
          {chatHistoryList.map((chat, index) => (
            <MessageWrapper key={index} $isMine={chat.sender === mail}>
              <MessageBubble $isMine={chat.sender === mail}>{chat.content}</MessageBubble>
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
            <Section ref={emojiPickerRef}>
              <Button onClick={() => setShowEmojiPicker((p) => !p)}>
                <img src={Emoji || '/placeholder.svg'} />
              </Button>
              {showEmojiPicker && (
                <PickerBox>
                  <Picker theme="light" onEmojiSelect={({ native }: { native: string }) => setNewChat((p) => p + native)} />
                </PickerBox>
              )}
            </Section>
            <Input onKeyDown={handleEnterPress} type="text" placeholder="메시지를 입력하세요" value={newChat} onChange={handleChange} />
            <SendButton disabled={!newChat.trim() || !profileInfo?.mail || !isConnected} onClick={handleSubmit}>
              <img src={PaperPlane || '/placeholder.svg'} />
            </SendButton>
          </InputBox>
        </ChatInputBox>
      </ChatContainer>
    </Container>
  )
}

export default Chat

// 기존 스타일 컴포넌트들...
const DropdownItem = styled.div`
  padding: 8px 12px;
  cursor: pointer;
  border-radius: 4px;
  &:hover {
    background-color: ${({ theme }) => theme.color.orange50};
    color: ${({ theme }) => theme.color.orange600};
  }
`

const Section = styled.div`
  position: relative;
`

const PickerBox = styled.div`
  position: absolute;
  bottom: 48px;
  left: -16px;
`

const ListSearchContainer = styled.div`
  width: 100%;
  padding: 8px;
`

const FriendListCount = styled.p`
  color: ${({ theme }) => theme.color.gray400};
  ${({ theme }) => theme.font.body6}
  padding: 4px 12px;
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
  z-index: 100;
  height: 400px;
  position: absolute;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  border-radius: 16px;
  gap: 8px;
`

const ModalList = styled.div`
  display: flex;
  flex-direction: column;
  overflow-y: scroll;
  width: 340px;
  height: 100%;
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
  padding: 70px 0 0;
  justify-self: center;
  display: flex;
`

const FriendListContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding: 24px 0 0;
  gap: 20px;
  width: 100%;
  max-width: 360px;
  height: 100%;
  min-width: 240px;
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

const Button = styled.button`
  background-color: transparent;
  cursor: pointer;
  position: relative;
  display: flex;
  align-items: center;
`

const FriendList = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
  overflow-y: auto;
`

const ProfileCardBox = styled.div`
  padding: 8px 12px;
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

const Dropdown = styled.div`
  position: absolute;
  top: 36px;
  right: 8px;
  background: white;
  padding: 8px 12px;
  border-radius: 6px;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.1);
  cursor: pointer;
  white-space: nowrap;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  ${({ theme }) => theme.font.body4}
  &:hover {
    background-color: ${({ theme }) => theme.color.orange50};
    color: ${({ theme }) => theme.color.orange600};
  }
`

const InputBox = styled.div`
  width: 100%;
  display: flex;
  background-color: white;
  padding: 4px 4px 4px 16px;
  border-radius: 16px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  gap: 8px;
  align-items: center;
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

const MessageWrapper = styled.div<{ $isMine: boolean }>`
  display: flex;
  align-items: end;
  flex-direction: ${({ $isMine }) => ($isMine ? 'row-reverse' : 'row')};
  gap: 8px;
`

const MessageBubble = styled.div<{ $isMine: boolean }>`
  padding: 10px 14px;
  border-radius: 20px;
  max-width: 60%;
  ${({ theme }) => theme.font.body3}
  ${({ $isMine, theme }) =>
    $isMine
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
