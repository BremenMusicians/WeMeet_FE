import { create } from 'zustand'
import { UserType } from '../apis/friends/type'

type User = {
  accountId: string
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
  profileInfo: Omit<UserType, 'isFriend'> | null
  setProfileInfo: (profile: Omit<UserType, 'isFriend'>) => void
  resetProfile: () => void
}

export const useProfileStore = create<ProfileStore>((set) => ({
  profileInfo: null,
  setProfileInfo: (profileInfo) => set({ profileInfo }),
  resetProfile: () => set({ profileInfo: null }),
}))
