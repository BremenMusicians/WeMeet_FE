import { instance } from '..'
import { MailPayload } from '../user/type'

const router = '/mail'

export const requestMailVerification = async (data: MailPayload) => {
  const { status } = await instance.post(router, data.mail)
  return status
}

export const confirmMailCode = async (data: MailPayload) => {
  const { status } = await instance.post(`${router}/check`, data)
  return status
}
