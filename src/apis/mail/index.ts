import { MailPayload } from './type'
import { authInstance } from '..'

const router = '/mail'

export const requestMailVerification = async (data: MailPayload) => {
  const response = await authInstance.post(router, { mail: data.mail })
  return response
}

export const confirmMailCode = async (data: MailPayload) => {
  const { status } = await authInstance.post(`${router}/check`, data)
  return status
}
