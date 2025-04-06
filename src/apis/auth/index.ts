import { instance } from '..'
import { LoginFormType, SignupFormType } from '../user/type'
import { saveToken } from '../../utils/Auth'

export const login = async (data: LoginFormType) => {
  const response = await instance.post('/login', data)
  const { accessToken, refreshToken } = response.data
  saveToken(accessToken, refreshToken)
}

export const signup = async (data: SignupFormType) => {
  const response = await instance.post('/signup', data)
  const { accessToken, refreshToken } = response.data
  saveToken(accessToken, refreshToken)
}

export const checkIdDuplication = (data: string) => {
  const response = instance.get(`/user/exist/${data}`)
  return response
}
