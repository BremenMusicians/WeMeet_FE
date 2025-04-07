import { Dispatch, SetStateAction, useState } from 'react'
import styled from 'styled-components'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { SignupResponseType } from '../../apis/user/type'

type SetStateType = { setStep: Dispatch<SetStateAction<number>>; setForm: Dispatch<SetStateAction<SignupResponseType>> }

function Second({ setStep, setForm }: SetStateType) {
  const [input, setInput] = useState({ password: '', checkPassword: '' })
  const [errors, setErrors] = useState({ password: '', checkPassword: '' })

  const passwordRegExp = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+]{4,20}$/

  const validation = () => {
    const newErrors = { password: '', checkPassword: '' }
    if (!input.password.trim()) {
      newErrors.password = '비밀번호을 입력해주세요'
    } else if (!passwordRegExp.test(input.password)) {
      newErrors.password = '하나 이상의 영문과 숫자를 조합해주세요'
    }
    if (!input.checkPassword.trim()) {
      newErrors.checkPassword = '비밀번호 확인을 입력해주세요'
    } else if (input.password !== input.checkPassword) {
      newErrors.checkPassword = '비밀번호가 알맞지 않습니다.'
    }
    setErrors(newErrors)
    return Object.values(newErrors).every((error) => error === '')
  }

  const handleCheckPassword = () => {
    if (validation()) {
      setForm((prev) => ({ ...prev, password: input.password }))
      setStep((prev) => prev + 1)
    }
  }

  return (
    <>
      <InputContainer>
        <InputBox>
          <Input type="password" name="password" value={input.password} label="비밀번호" placeholder="⦁⦁⦁⦁⦁⦁⦁⦁" onChange={(e) => setInput({ ...input, password: e.target.value })} />
          <ErrorMessage>{errors.password}</ErrorMessage>
        </InputBox>
        <InputBox>
          <Input
            type="password"
            name="confirmPassword"
            value={input.checkPassword}
            label="비밀번호 확인"
            placeholder="⦁⦁⦁⦁⦁⦁⦁⦁"
            onChange={(e) => setInput({ ...input, checkPassword: e.target.value })}
          />
          <ErrorMessage>{errors.checkPassword}</ErrorMessage>
        </InputBox>
      </InputContainer>
      <Button disabled={!(input.checkPassword && input.password)} bigSize onClick={handleCheckPassword}>
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
const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.color.orange500};
  ${({ theme }) => theme.font.body6}
`

const InputContainer = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export default Second
