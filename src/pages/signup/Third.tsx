import { useState } from 'react'
import styled from 'styled-components'
import { Input } from '../../components/Input'
import { Button } from '../../components/Button'
import { position, positionEnum, SignupResponseType } from '../../apis/user/type'
import { checkIdDuplication, signup } from '../../apis/auth'

type SetStateType = { form: SignupResponseType }
type ErrorType = { accountId: string; position: position[] }

function Third({ form }: SetStateType) {
  const [input, setInput] = useState<ErrorType>({ accountId: '', position: [] })
  const [errors, setErrors] = useState<Record<string, string>>({ accountId: '', position: '' })
  const [checked, setChecked] = useState<boolean>(false)

  const validation = () => {
    const newErrors = { accountId: '', position: '' }
    if (!input.accountId.trim()) newErrors.accountId = '닉네임을 입력해주세요'
    if (!input.position.length) newErrors.position = '포지션을 선택해주세요'

    setErrors(newErrors)
    return Object.values(newErrors).every((error) => error === '')
  }

  const handleSubmit = async () => {
    if (validation()) {
      const finalForm: SignupResponseType = { ...form, accountId: input.accountId, position: input.position }
      try {
        await signup(finalForm)
      } catch (error) {
        setErrors((prev) => ({ ...prev, position: error.response?.data.message || '회원가입 중 오류가 발생했습니다' }))
      }
    }
  }

  const handleCheckId = async () => {
    try {
      await checkIdDuplication(input.accountId)
      setChecked(true)
    } catch (error) {
      setErrors((prev) => ({ ...prev, accountId: error.response?.data.message || '해당 닉네임이 존재합니다' }))
    }
  }

  const handleTogglePosition = (item: position) => {
    const updated = input.position.includes(item) ? input.position.filter((p) => p !== item) : [...input.position, item]
    setInput({ ...input, position: updated })
  }

  const positionList: position[] = ['PIANO', 'SYNTH', 'VOCAL', 'DRUM', 'GUITAR', 'ETC']
  return (
    <>
      <InputContainer>
        <InputBox>
          <EmailInput>
            <Input type="text" name="accountId" value={input.accountId} label="닉네임" placeholder="닉네임" onChange={(e) => setInput({ ...input, accountId: e.target.value })} />
            <Button width={128} bigSize onClick={handleCheckId}>
              중복 확인
            </Button>
          </EmailInput>
          <ErrorMessage>{errors.accountId}</ErrorMessage>
        </InputBox>
        <SelectTagBox>
          <Label>포지션</Label>
          <TagBox>
            {positionList.map((item) => (
              <Tag key={item} onClick={() => handleTogglePosition(item)} className={input.position.includes(item) ? 'selected' : ''}>
                {positionEnum[item]}
              </Tag>
            ))}
          </TagBox>
          <ErrorMessage>{errors.position}</ErrorMessage>
        </SelectTagBox>
      </InputContainer>
      <Button disabled={!(input.accountId.length && input.position.length && checked)} bigSize onClick={handleSubmit}>
        회원가입
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

const InputContainer = styled.div`
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
  &.selected {
    background-color: ${({ theme }) => theme.color.orange100};
    color: ${({ theme }) => theme.color.orange500};
    border-color: ${({ theme }) => theme.color.orange200};
  }
`

export default Third
