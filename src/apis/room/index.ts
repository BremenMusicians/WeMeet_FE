import { MutateOptions, useMutation, useQuery } from "@tanstack/react-query"
import { instance } from ".."
import { concertRoomResponse, CreateRoomResponse, createRoomType, KickOutMemberType } from "./type"

const router = '/rooms'

export const useCreateRoom = (
    option: MutateOptions<CreateRoomResponse, Error, createRoomType>,
    dataType: createRoomType
) => {
    return useMutation<CreateRoomResponse, Error, createRoomType>({
        ...option,
        mutationFn: async () => {
            const { data } = await instance.post<CreateRoomResponse>(`${router}`, dataType);
            return data;
        },
    });
};

export const useGetConcertRoom = (page = 0) => {
    return useQuery({
        queryKey: ["concertRoom"],
        queryFn: async () => {
            const {data} = await instance.get<concertRoomResponse>(`${router}?page=${page}`);
            return data
        }
    })
}

export const useExitConcertRoom = (option: MutateOptions, roomId: string) => {
    return useMutation({
        ...option,
        mutationFn: async () => {
            const {data} = await instance.delete(`${router}/${roomId}`)
            return data
        }
    })
}

export const useCheckPassword = (option: MutateOptions, roomId: string, password: string) => {
    return useMutation({
        ...option,
        mutationFn: async () => {
            const {data} = await instance.post(`${router}/password/${roomId}`, {password: password})
            return data;
        }
    })
}

export const useEntryRoom = (option: MutateOptions, roomId: string) => {
    return useMutation({
        ...option,
        mutationFn: async () => {
            const {data} = await instance.post(`${router}/${roomId}`)
            return data;
        }
    })
}

export const useKickOutMember = () => {
    return useMutation({
        mutationFn: async ({roomId, accountId}:KickOutMemberType) => {
            const {data} = await instance.delete(`${router}/${roomId}/members/${accountId}`);
            return data;
        }
    })
}