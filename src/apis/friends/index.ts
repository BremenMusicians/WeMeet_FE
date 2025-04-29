import { MutationOptions, useMutation, useQuery } from "@tanstack/react-query"
import { instance } from ".."
import { ChangeFriendRequestType, DeleteFriendRequestType, RequestFriendListType } from "./type"
import { useFriendListQuery } from "../../hooks/useFriendListQueryFactory"

const router = '/friends'


export const useFriendRequest = () => {
    return useMutation({
        mutationFn: async (friendId: string) => {
            const { data } = await instance.post(`${router}/${friendId}`)
            return data;
        },
    })
}

export const useChangeFriend = (option: MutationOptions<void, Error, ChangeFriendRequestType>) => {
  return useMutation<void, Error, ChangeFriendRequestType>({
    ...option,
    mutationFn: async ({ friendId, accept }) => {
      const { data } = await instance.patch(`${router}/request/${friendId}?accept=${accept}`)
      return data
    },
  })
}

export const useGetRequestFriendList = () => {
  return useQuery({
    queryKey: ['getRequestFriendList'],
    queryFn: async () => {
      const {data} = await instance.get<RequestFriendListType>(`${router}/request`);
      return data.friendRequests
    }
  })
}

export const useDeleteFriend = (option:MutationOptions<void, Error, DeleteFriendRequestType>) => {
  return useMutation<void, Error, DeleteFriendRequestType>({
    ...option,
    mutationFn: async ({accountId}) => {
      const {data} = await instance.delete(`${router}/${accountId}`)
      return data
    }
  })
}

export const useGetMyFriendList = (name: string) => {
  return useFriendListQuery({ queryKey: ['myFriendList', name], endpoint: `${router}/my`, name })
}

export const useGetRecommendFriendList = (name: string) => {
  return useFriendListQuery({ queryKey: ['recommendFriendList', name], endpoint: router, name })
}