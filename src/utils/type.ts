export type PositionType = 'PIANO' | 'DRUM' | 'GUITAR' | 'SYNTH' | 'VOCAL' | 'ETC'
export type InstrumentType = '피아노' | '드럼' | '신스' | '기타'

export interface RoomSocketPayloadType {
  mail: string
  accountId: string
  profile: string
}

export interface RoomSocketType {
  type: 'join' | 'leave' | 'exist'
  payload: RoomSocketPayloadType[]
}
