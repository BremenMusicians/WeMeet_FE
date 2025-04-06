import styled from 'styled-components'
import { AuthLayout } from '../../components/AuthLayout'
import First from './First'
import { useState } from 'react'
import Second from './Second'
import Third from './Third'
import { SignupFormType } from '../../apis/user/type'

function Signup() {
  const [form, setForm] = useState<SignupFormType>({
    mail: '',
    password: '',
    accountId: '',
    position: [],
  })
  const [step, setStep] = useState<number>(2)
  const signupPage = [<First setForm={setForm} setStep={setStep} key="first" />, <Second setForm={setForm} setStep={setStep} key="second" />, <Third form={form} setForm={setForm} key="third" />]
  return (
    <AuthLayout title="회원가입" description="온라인 합주를 시작해볼까요">
      <SignupFormBox>
        {signupPage[step]}
        <IsExistMember>
          계정이 있나요? <LoginLink>로그인</LoginLink>
        </IsExistMember>
      </SignupFormBox>
    </AuthLayout>
  )
}

const SignupFormBox = styled.div`
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`

const IsExistMember = styled.p`
  color: ${({ theme }) => theme.color.gray400};
  ${({ theme }) => theme.font.body6};
`

const LoginLink = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.color.gray500};
  ${({ theme }) => theme.font.body5}
`

export default Signup
