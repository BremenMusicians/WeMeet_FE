import { MutateOptions, useMutation, useQuery } from '@tanstack/react-query'
import { instance } from '..'
import { editMypage, myPageType } from './type'
import { LoginRequestType, SignupRequestType } from '../user/type'
import { saveToken } from '../../utils/Auth'
import axios from 'axios'

const router = '/user'

const BASEURL = import.meta.env.VITE_SERVER_BASE_URL

const authInstance = axios.create({
  baseURL: BASEURL,
})

export const login = async (formData: LoginRequestType) => {
  const { data } = await authInstance.post(`${router}/signIn`, formData)
  saveToken(data.accessToken, data.refreshToken)
}

export const signup = async (formData: SignupRequestType) => {
  const { data } = await authInstance.post(`${router}/signUp`, formData)
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
