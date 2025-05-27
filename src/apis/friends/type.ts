import { position } from '../user/type'

export interface UserType {
  accountId: string
  mail: string
  profile: null | string
  aboutMe: null | string
  position: position[]
  isFriend: 'NOT_FRIEND' | 'FRIEND' | 'WAITING'
  chatId: string
}

export interface FriendResponseType {
  users: UserType[]
  friendsCnt: number
}

export interface ChangeFriendRequestType {
  friendId: string
  accept: boolean
}

export interface FriendType {
  friendId: string
  accountId: string
  profile: null | string
  aboutMe: string | null
  position: position[]
}

export interface RequestFriendListType {
  friendRequests: FriendType[]
  requestCnt: number
}

export interface DeleteFriendRequestType {
  accountId: string
}
