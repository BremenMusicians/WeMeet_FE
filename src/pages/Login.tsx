import { useState } from 'react'
import styled from 'styled-components'
import { Input } from '../components/Input'
import { Button } from '../components/Button'
import { AuthLayout } from '../components/AuthLayout'
import { useNavigate } from 'react-router-dom'
import { login } from '../apis/auth'
import { LoginFormType } from '../apis/user/type'

function Login() {
  const navigate = useNavigate()
  const [form, setForm] = useState<LoginFormType>({ mail: '', password: '' })
  const [errors, setErrors] = useState<LoginFormType>({ mail: '', password: '' })

  const mailRegExp = /^[a-zA-Z0-9+-\_.]+@[a-zA-Z0-9-]+\.[a-zA-Z0-9-.]+$/
  const validation = () => {
    const newErrors = { mail: '', password: '' }
    if (!form.mail.trim()) {
      newErrors.mail = '이메일을 입력해주세요'
    } else if (!mailRegExp.test(form.mail)) {
      newErrors.mail = '유효한 이메일 형식이 아닙니다'
    }
    if (!form.password.trim()) {
      newErrors.password = '비밀번호를 입력해주세요'
    }
    setErrors(newErrors)
    return Object.values(newErrors).every((error) => error === '')
  }

  const handleLogin = async () => {
    if (validation()) {
      try {
        await login(form)
        navigate('/main')
      } catch (e) {
        console.log(e)
      }
    }
  }

  return (
    <AuthLayout title="로그인" description="온라인 합주를 시작해볼까요">
      <>
        <LoginFormBox>
          <Form>
            <InputBox>
              <Input type="text" name="mail" value={form.mail} label="이메일" placeholder="you@example.com" onChange={(e) => setForm({ ...form, mail: e.target.value })} />
              <ErrorMessage>{errors.mail}</ErrorMessage>
            </InputBox>
            <InputBox>
              <Input type="password" name="password" value={form.password} label="비밀번호" placeholder="⦁⦁⦁⦁⦁⦁⦁⦁" onChange={(e) => setForm({ ...form, password: e.target.value })} />
              <ErrorMessage>{errors.password}</ErrorMessage>
            </InputBox>
          </Form>
          <Button bigSize onClick={handleLogin}>
            로그인
          </Button>
          <IsNewMember>
            계정이 없나요? <SignupLink onClick={() => navigate('/signup')}>회원가입</SignupLink>
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

const Form = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 24px;
`

const InputBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
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

const ErrorMessage = styled.p`
  color: ${({ theme }) => theme.color.orange500};
  ${({ theme }) => theme.font.body5}
`

export default Login
