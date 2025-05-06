import { position } from "../user/type"

export interface createRoomType {
	name : string,
	maxMember : number,
	info : string,
	password : string | null,
}

export interface CreateRoomResponse {
	roomId: string
}

export interface ConcertRoomType {
	id :string,
	name : string,
	info : string,
	isPublic : boolean,
	currentMember : number,
	maxMember : number
}

export interface concertRoomResponse {
	roomCount: number,
	rooms : ConcertRoomType[]
}

export interface KickOutMemberType {
	roomId: string,
	accountId: string
}

export interface concertRoomMemberType {
	mail : string,
	position : position
}

export interface concertRoomInfoResponse {
	name : string,
	info : string,
	password : null | string,
	max_member : number,
	owner : string,
	members : concertRoomMemberType[]
}