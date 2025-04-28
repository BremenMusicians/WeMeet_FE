import { useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { instance } from ".."
import { ChangeFriendRequestType, RequestFriendListType } from "./type"

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
  
  export const useGetRecommendFriendList = (name: string) => {
    return useInfiniteQuery({
        queryKey: ['recommend-friend-list', name],
        queryFn: async ({ pageParam = 0 }) => {
          const { data } = await instance.get(`${router}?page=${pageParam}&name=${encodeURIComponent(name)}`)
          return { ...data, page: pageParam }
        },
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((acc, page) => acc + page.users.length, 0)
            const totalAvailable = lastPage.usersCnt
            
            if (totalFetched < totalAvailable) {
              return lastPage.page + 1
            }
            return undefined
          },
        staleTime: 1000 * 60,
        initialPageParam: 0
      })
      
  }

export const useGetRequestFriendList = () => {
  return useQuery({
    queryKey: ['getRequestFriendList'],
    queryFn: async () => {
      const {data} = await instance.get<RequestFriendListType>(`${router}/list`);
      return data.friendRequests
    }
  })
}