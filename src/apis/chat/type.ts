import { position } from '../user/type'

export interface ChatListType {
  chatId: string
  accountId: string
  profile?: string
  position: position[]
  lastMessage?: string
}

export interface ChatListResponse {
  chats: ChatListType[]
  type: 'UPDATE_CHAT_LIST' | 'MESSAGE'
}

export interface SendMailFormat {
  receiver: string
  content: string
}

export interface ReceiveMailFormat {
  sender: string
  sendAt: string
  content: string
}
