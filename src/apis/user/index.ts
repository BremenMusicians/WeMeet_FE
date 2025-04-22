import { MutateOptions, useMutation, useQuery } from '@tanstack/react-query'
import { authInstance, instance } from '..'
import { AuthResponseType, editMypage, myPageType } from './type'
import { LoginRequestType, SignupRequestType } from '../user/type'
import { saveToken } from '../../utils/Auth'

const router = '/user'

export const login = async (formData: LoginRequestType) => {
  const { data } = await authInstance.post<AuthResponseType>(`${router}/signIn`, formData)
  saveToken(data.accessToken, data.refreshToken)
}

export const signup = async (formData: SignupRequestType) => {
  const { data } = await authInstance.post<AuthResponseType>(`${router}/signUp`, formData)
  saveToken(data.accessToken, data.refreshToken)
}

export const checkIdDuplication = async (data: string) => {
  const response = await authInstance.get(`${router}/exist/${data}`)
  return response
}

export const useGetMyInformation = () => {
  return useQuery({
    queryKey: ['mypage'],
    queryFn: async () => {
      const { data } = await instance.get<myPageType>(`${router}/myPage`)
      return data
    },
  })
}

export const useEditMypage = (option: MutateOptions, dataType: editMypage) => {
  return useMutation({
    ...option,
    mutationFn: async () => {
      const { data } = await instance.patch(`${router}/update`, dataType)
      return data
    },
  })
}

export const useDuplicateCheck = (option: MutateOptions, accountId: string) => {
  return useMutation({
    ...option,
    mutationFn: async () => {
      const { data } = await instance.get(`${router}/${accountId}`)
      return data
    },
  })
}

export const useChangeProfileImg = (option: MutateOptions, file: File) => {
  return useMutation({
    ...option,
    mutationFn: async () => {
      const formData = new FormData()
      formData.append('file', file)
      const { data } = await instance.patch(`${router}/profile`, formData)
      return data
    },
  })
}


export const useUserQuery = () => {
  return useQuery({
    queryKey: ['user'],
    queryFn: async () => {
      const {data} = await instance.get<{accountId:string}>(`${router}/accountId`)
      return data
    },
    retry: false,
    refetchOnWindowFocus: false,
  });
};