export interface createRoomType {
	name : string,
	maxMember : number,
	info : string,
	password? : string
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