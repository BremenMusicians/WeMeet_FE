export type position =  "DRUM" | "GUITAR" | "PIANO" | "SYNTH" | "VOCAL" | "ETC"

export enum positionEnum {
  "PIANO" = "피아노",
  "GUITAR"= "기타",
  "DRUM"= "드럼",
  "SYNTH"= "신스",
  "VOCAL"= "보컬",
  "ETC"= "그 외"
}

export interface friendType{
    accountId: string,
    profile: string | null,
    aboutMe: string | null,
    position: position[]
}

export interface myPageType {
    accountId: string,
    profile: string | null,
    aboutMe: string | null,
    position: position[]
    friendsCnt: number,
    friends: friendType[]
}

export interface editMypage {
    accountId: string,
    aboutMe: string | null, 
    position: position[]
}