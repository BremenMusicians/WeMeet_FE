import { MutateOptions, useMutation, useQuery } from "@tanstack/react-query"
import { instance } from ".."
import { editMypage, myPageType } from "./type"

const router = '/user'

export const useGetMyInfomation = () => {
    return useQuery({
        queryKey: ['mypage'],
        queryFn: async () => {
            const { data } = await instance.get<myPageType>(`${router}/myPage`);
            return data
        }
    })
}

export const useEditMypage = (option : MutateOptions, dataType: editMypage) => {
    return useMutation({
        ...option,
        mutationFn: async () => {
            const {data} = await instance.patch(`${router}/update`, 
                dataType
            );
            return data;
        }
    })
}

export const useDuplicateCheck = (option:MutateOptions, accountId: string) => {
    return useMutation({
        ...option,
        mutationFn: async () => {
            const {data} = await instance.get(`${router}/${accountId}`)
            return data
        }
    })
}