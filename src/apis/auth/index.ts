import { instance } from '..'
import { LoginResponseType, SignupResponseType } from '../user/type'
import { saveToken } from '../../utils/Auth'
import axios from 'axios'

export const login = async (data: LoginResponseType) => {
  const response = await axios.post('/login', data)
  const { accessToken, refreshToken } = response.data
  saveToken(accessToken, refreshToken)
}

export const signup = async (data: SignupResponseType) => {
  const response = await axios.post('/signup', data)
  const { accessToken, refreshToken } = response.data
  saveToken(accessToken, refreshToken)
}

export const checkIdDuplication = async (data: string) => {
  const response = await axios.get(`/user/exist/${data}`)
  return response
}
