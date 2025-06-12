import { MutateOptions, useInfiniteQuery, useMutation, useQuery } from "@tanstack/react-query"
import { instance } from ".."
import { concertRoomInfoResponse, CreateRoomResponse, createRoomType, KickOutMemberType } from "./type"

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

export const useGetConcertRoom = (name: string) => {
    return useInfiniteQuery({
        queryKey: ['getConcertRoom', name],
        queryFn: async ({pageParam = 0}) => {
            const {data} = await instance.get(`${router}?page=${pageParam}&name=${encodeURIComponent(name)}`);
            return {...data, page: pageParam}
        },
        getNextPageParam: (lastPage, allPages) => {
            const totalFetched = allPages.reduce((acc, page) => acc + page.rooms.length, 0)
            const totalAvailable = lastPage.roomCount

            if (totalFetched < totalAvailable) {
              return lastPage.page + 1
            }
            return undefined
          },
        staleTime: 1000 * 60,
        initialPageParam: 0
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

export const useGetRoomInfo = (roomId: string, enabled: boolean) => {
    return useQuery({
      queryKey: ['roomInfo', roomId],
      queryFn: async () => {
        const { data } = await instance.get<concertRoomInfoResponse>(`${router}/${roomId}`);
        return data;
      },
      enabled,
    });
  };