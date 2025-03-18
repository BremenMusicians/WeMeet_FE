import styled from 'styled-components'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'

function Third() {
  const position = ['드럼', '기타', '피아노', '신스', '보컬', '그 외']
  return (
    <>
      <InputBox>
        <EmailInput>
          <Input type="text" name="nickname" value="" label="닉네임" placeholder="닉네임" onChange={() => {}} />
          <Button bigSize onClick={() => {}}>
            중복 확인
          </Button>
        </EmailInput>
        <SelectTagBox>
          <Label>포지션</Label>
          <TagBox>
            {position.map((item) => (
              <Tag key={item}>{item}</Tag>
            ))}
          </TagBox>
        </SelectTagBox>
      </InputBox>
      <Button bigSize onClick={() => {}}>
        회원가입
      </Button>
    </>
  )
}

const SelectTagBox = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const Label = styled.p`
  ${({ theme }) => theme.font.body6}
`

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

const TagBox = styled.div`
  width: 100%;
  display: flex;
  gap: 8px;
`

const Tag = styled.button`
  display: flex;
  padding: 8px 14px;
  border-radius: 6px;
  background-color: ${({ theme }) => theme.color.gray50};
  color: ${({ theme }) => theme.color.gray600};
  border: 1px solid ${({ theme }) => theme.color.gray200};
  white-space: nowrap;
  &:hover {
    background-color: ${({ theme }) => theme.color.gray100};
  }
  ${({ theme }) => theme.font.body5}
`

export default Third
