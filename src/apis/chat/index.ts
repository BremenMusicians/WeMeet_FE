import { useQuery } from '@tanstack/react-query'
import { instance } from '..'
import { ReceiveMailFormat } from './type'

export const useGetChatHistory = (chatId: string, enabled: boolean) => {
  return useQuery({
    queryKey: ['chatHistory'],
    queryFn: async () => {
      const { data } = await instance.get<ReceiveMailFormat[]>(`/message/${chatId}`)
      return data
    },
    enabled,
  })
}
