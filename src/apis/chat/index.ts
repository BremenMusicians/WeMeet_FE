import { useQuery } from '@tanstack/react-query'
import { instance } from '..'
import { ChatListType, ChatMessageType } from './type'

const router = '/chat'

export const useGetChatList = () => {
  return useQuery({
    queryKey: ['chatList'],
    queryFn: async () => {
      const { data } = await instance.get<ChatListType[]>(`${router}/list`)
      return data
    },
  })
}

export const getChatHistory = (chatId: string) => {
  return useQuery({
    queryKey: ['chatHistory'],
    queryFn: async () => {
      const { data } = await instance.get<ChatMessageType[]>(`/message/${chatId}`)
      return data
    },
  })
}
