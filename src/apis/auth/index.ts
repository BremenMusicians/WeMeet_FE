import { LoginRequestType, SignupRequestType } from '../user/type'
import { saveToken } from '../../utils/Auth'
import axios from 'axios'

const BASEURL = import.meta.env.VITE_SERVER_BASE_URL

const authInstance = axios.create({
  baseURL: BASEURL,
})

export const login = async (formData: LoginRequestType) => {
  const { data } = await authInstance.post('/login', formData)
  saveToken(data.accessToken, data.refreshToken)
}

export const signup = async (formData: SignupRequestType) => {
  const { data } = await authInstance.post('/signup', formData)
  saveToken(data.accessToken, data.refreshToken)
}

export const checkIdDuplication = async (data: string) => {
  const response = await authInstance.get(`/user/exist/${data}`)
  return response
}
