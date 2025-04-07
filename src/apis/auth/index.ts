import { LoginRequestType, SignupRequestType } from '../user/type'
import { saveToken } from '../../utils/Auth'
import axios from 'axios'

const BASEURL = import.meta.env.VITE_SERVER_BASE_URL

const authInstance = axios.create({
  baseURL: BASEURL,
})

export const login = async (data: LoginRequestType) => {
  const response = await authInstance.post('/login', data)
  const { accessToken, refreshToken } = response.data
  saveToken(accessToken, refreshToken)
}

export const signup = async (data: SignupRequestType) => {
  const response = await authInstance.post('/signup', data)
  const { accessToken, refreshToken } = response.data
  saveToken(accessToken, refreshToken)
}

export const checkIdDuplication = async (data: string) => {
  const response = await authInstance.get(`/user/exist/${data}`)
  return response
}
