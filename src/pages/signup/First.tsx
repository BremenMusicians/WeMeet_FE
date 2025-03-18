import styled from 'styled-components'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'

function First() {
  return (
    <>
      <InputBox>
        <EmailInput>
          <Input type="text" name="" value="" label="이메일" placeholder="you@example.com" onChange={() => {}} />
          <Button bigSize onClick={() => {}}>
            인증
          </Button>
        </EmailInput>
        <Input type="text" name="" value="" label="인증 코드" placeholder="123456" onChange={() => {}} />
      </InputBox>
      <Button disabled bigSize onClick={() => {}}>
        다음
      </Button>
    </>
  )
}

const EmailInput = styled.div`
  display: flex;
  gap: 8px;
  align-items: end;
`

const InputBox = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
`

export default First
