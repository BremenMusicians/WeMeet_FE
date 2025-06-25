import { create } from 'zustand'
import { ChatUserProfile } from '../apis/chat/type'

type User = {
  accountId: string
  profile: string
}

type UserStore = {
  user: User | null
  setUser: (user: User) => void
  clearUser: () => void
}

export const useUserStore = create<UserStore>((set) => ({
  user: null,
  setUser: (user) => set({ user }),
  clearUser: () => set({ user: null }),
}))

type ProfileStore = {
  profileInfo: ChatUserProfile
  setProfileInfo: (profile: ChatUserProfile) => void
  resetProfile: () => void
}

const profileInitValue = { accountId: '', mail: '', profile: '', position: [], chatId: '' }

export const useProfileStore = create<ProfileStore>((set) => ({
  profileInfo: profileInitValue,
  setProfileInfo: (profileInfo) => set({ profileInfo }),
  resetProfile: () => set({ profileInfo: profileInitValue }),
}))
