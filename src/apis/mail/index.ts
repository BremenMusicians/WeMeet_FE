import axios from 'axios'
import { MailPayload } from '../user/type'

const router = '/mail'

const BASEURL = import.meta.env.VITE_SERVER_BASE_URL

const authInstance = axios.create({
  baseURL: BASEURL,
})

export const requestMailVerification = async (data: MailPayload) => {
  const response = await authInstance.post(router, { mail: data.mail })
  return response
}

export const confirmMailCode = async (data: MailPayload) => {
  const { status } = await authInstance.post(`${router}/check`, data)
  return status
}
