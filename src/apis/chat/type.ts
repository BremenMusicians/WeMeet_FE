import { position } from '../user/type'

export interface ChatMessageType {
  sender: string
  content: string
  sendAt: string
}

export interface ChatListType {
  chatId: string
  accountId: string
  profile: null | string
  position: position[]
  lastMessage?: string | null
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
