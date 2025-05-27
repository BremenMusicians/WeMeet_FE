import { create } from 'zustand'
import React from 'react'

interface Participant {
  mail: string
  accountId: string
  profile: string
  audioRef: React.RefObject<HTMLAudioElement | null>
}

interface ParticipantsState {
  participants: Participant[]
  addParticipant: (participant: Omit<Participant, 'audioRef'>) => void
  removeParticipant: (mail: string) => void
  clearParticipants: () => void
}

export const useParticipantsStore = create<ParticipantsState>((set) => ({
  participants: [],
  addParticipant: (participant) =>
    set((state) => {
      const exists = state.participants.find((p) => p.mail === participant.mail)
      if (exists) return state

      return {
        participants: [
          ...state.participants,
          {
            ...participant,
            audioRef: React.createRef<HTMLAudioElement>(),
          },
        ],
      }
    }),
  removeParticipant: (mail) =>
    set((state) => ({
      participants: state.participants.filter((p) => p.mail !== mail),
    })),
  clearParticipants: () => set({ participants: [] }),
}))
