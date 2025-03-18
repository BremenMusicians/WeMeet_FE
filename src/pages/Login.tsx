import styled from 'styled-components'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { AuthLayout } from '../components/AuthLayout'

function Login() {
  return (
    <AuthLayout title="로그인" description="온라인 합주를 시작해볼까요">
      <>
        <LoginFormBox>
          <InputBox>
            <Input type="text" name="" value="" label="이메일" placeholder="you@example.com" onChange={() => {}} />
            <Input type="password" name="" value="" label="비밀번호" placeholder="⦁⦁⦁⦁⦁⦁⦁⦁" onChange={() => {}} />
          </InputBox>
          <Button bigSize onClick={() => {}}>
            로그인
          </Button>
          <IsNewMember>
            계정이 없나요? <SignupLink>회원가입</SignupLink>
          </IsNewMember>
        </LoginFormBox>
      </>
    </AuthLayout>
  )
}

const LoginFormBox = styled.div`
  width: 380px;
  display: flex;
  flex-direction: column;
  gap: 40px;
`

const InputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

const IsNewMember = styled.p`
  color: ${({ theme }) => theme.color.gray400};
  ${({ theme }) => theme.font.body6};
`

const SignupLink = styled.span`
  cursor: pointer;
  color: ${({ theme }) => theme.color.gray500};
  ${({ theme }) => theme.font.body5}
`

export default Login
