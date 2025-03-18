import styled from 'styled-components'
import { AuthLayout } from '../../components/AuthLayout'
import First from './First'
import { useState } from 'react'
import Second from './Second'
import Third from './Third'

function Signup() {
  const [step, setStep] = useState<number>(2)
  const signupPage = [<First />, <Second />, <Third />]
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
