import styled from 'styled-components'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'

function Second() {
  return (
    <>
      <InputBox>
        <Input type="password" name="" value="" label="비밀번호" placeholder="⦁⦁⦁⦁⦁⦁⦁⦁" onChange={() => {}} />
        <Input type="password" name="" value="" label="비밀번호 확인" placeholder="⦁⦁⦁⦁⦁⦁⦁⦁" onChange={() => {}} />
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

export default Second
