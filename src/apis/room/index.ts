import { MutateOptions, useMutation, useQuery } from "@tanstack/react-query"
import { instance } from ".."
import { concertRoomResponse, CreateRoomResponse, createRoomType } from "./type"

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

export const useGetConcertRoom = () => {
    return useQuery({
        queryKey: ["concertRoom"],
        queryFn: async () => {
            const {data} = await instance.get<concertRoomResponse>(`${router}?page=0`);
            return data
        }
    })
}

export const useEntryConcertRoom = (option: MutateOptions, id:string) => {
    return useMutation({
        ...option,
        mutationFn: async () => {
            const {data} = await instance.get(`${router}/${id}`)
            return data
        }
    })
}