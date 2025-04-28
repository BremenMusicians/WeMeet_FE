import { useQuery } from '@tanstack/react-query'
import { instance } from '..'
import { ChatListResponse, ChatMessageType } from './type'

const router = '/chat'

export const useGetChatList = () => {
  return useQuery({
    queryKey: ['chatList'],
    queryFn: async () => {
      const { data } = await instance.get<ChatListResponse>(`${router}/list`)
      return data.chats
    },
  })
}

export const useGetChatHistory = (chatId: string) => {
  return useQuery({
    queryKey: ['chatHistory'],
    queryFn: async () => {
      const { data } = await instance.get<ChatMessageType[]>(`/message/${chatId}`)
      return data
    },
  })
}
