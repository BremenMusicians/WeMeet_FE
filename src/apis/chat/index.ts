import { useQuery } from '@tanstack/react-query'
import { instance } from '..'
import { ChatMessageType } from './type'

export const useGetChatHistory = (chatId: string) => {
  return useQuery({
    queryKey: ['chatHistory'],
    queryFn: async () => {
      const { data } = await instance.get<ChatMessageType[]>(`/message/${chatId}`)
      return data
    },
  })
}
