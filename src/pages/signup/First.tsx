import { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { MailPayload, SignupRequestType } from '../../apis/user/type'
import { confirmMailCode, requestMailVerification } from '../../apis/auth/mail'
import { mailRegExp } from '../../utils/regExp'

type SetStateType = { setStep: Dispatch<SetStateAction<number>>; setForm: Dispatch<SetStateAction<SignupRequestType>> }

function First({ setStep, setForm }: SetStateType) {
  const [input, setInput] = useState<MailPayload>({ mail: '', code: '' })
  const [errors, setErrors] = useState<MailPayload>({ mail: '', code: '' })
  const [isSent, setIsSent] = useState<boolean>(false)

  const validation = () => {
    const newErrors = { mail: '', code: '' }
    if (!input.mail.trim()) {
      newErrors.mail = '이메일을 입력해주세요'
    } else if (!mailRegExp.test(input.mail)) {
      newErrors.mail = '유효한 이메일 형식이 아닙니다'
    }
    setErrors(newErrors)
    return Object.values(newErrors).every((error) => error === '')
  }

  const handleMailSent = async () => {
    if (validation()) {
      try {
        await requestMailVerification(input).then(() => setIsSent(true))
      } catch (error) {
        setErrors((prev) => ({ ...prev, mail: error.response?.data.message || '이메일 전송 중 오류가 발생했습니다' }))
      }
    }
  }

  const handleVerifyCode = async () => {
    try {
      await confirmMailCode(input)
      setForm((prev) => ({ ...prev, mail: input.mail }))
      setStep((prev) => prev + 1)
    } catch (error) {
      if (error.response?.status == 401) setErrors((prev) => ({ ...prev, code: '인증 코드가 일치하지 않습니다' }))
      else setErrors((prev) => ({ ...prev, code: error.response?.data.message || '인증 중 오류가 발생했습니다' }))
    }
  }

  return (
    <>
      <InputContainer>
        <InputBox>
          <EmailInput>
            <Input type="text" name="email" value={input.mail} label="이메일" placeholder="you@example.com" onChange={(e) => setInput({ ...input, mail: e.target.value })} />
            <Button disabled={!input.mail.trim()} width={64} bigSize onClick={handleMailSent}>
              인증
            </Button>
          </EmailInput>
          {isSent && <SuccessMessage>이메일로 인증 코드를 전송했습니다</SuccessMessage>}
          <ErrorMessage>{errors.mail}</ErrorMessage>
        </InputBox>
        <InputBox>
          <Input type="text" name="verificationCode" value={input.code} label="인증 코드" placeholder="123456" onChange={(e) => setInput({ ...input, code: e.target.value })} />
          <ErrorMessage>{errors.code}</ErrorMessage>
        </InputBox>
      </InputContainer>
      <Button disabled={!input.code.trim() || !isSent} bigSize onClick={handleVerifyCode}>
        다음
      </Button>
    </>
  )
}

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const EmailInput = styled.div`
  display: flex;
  gap: 8px;
  align-items: end;
`

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const SuccessMessage = styled.p`
  color: ${({ theme }) => theme.color.gray400};
  ${({ theme }) => theme.font.body6}
`

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.color.orange500};
  ${({ theme }) => theme.font.body6}
`

export default First
