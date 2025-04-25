import { useInfiniteQuery, useMutation } from "@tanstack/react-query"
import { instance } from ".."
import { ChangeFriendRequestType } from "./type"

const router = '/friends'


export const useFriendRequest = () => {
    return useMutation({
        mutationFn: async (friendId: string) => {
            const { data } = await instance.post(`${router}/${friendId}`)
            return data;
        },
    })
}

  export const useChangeFriend = () => {
    return useMutation<void, Error, ChangeFriendRequestType>({
      mutationFn: async ({ accountId, accept }) => {
        const { data } = await instance.patch(`${router}/request/${accountId}?accept=${accept}`)
        return data
      },
    })
  }
  