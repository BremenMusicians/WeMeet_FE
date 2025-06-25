import styled from 'styled-components'
import { Input } from '../../components/Input'
import { Banner, Check, Plus, Profile } from '../../assets'
import React, { useEffect, useState } from 'react'
import { Button } from '../../components/Button'
import { useChangeProfileImg, useDuplicateCheck, useEditMypage, useGetMyInformation } from '../../apis/user'
import { editMypage, position, positionEnum } from '../../apis/user/type'
import { useNavigate } from 'react-router-dom'
import { useQueryClient } from '@tanstack/react-query'

export const EditMyPage = () => {
  const navigator = useNavigate()
  const { data: MyData } = useGetMyInformation()
  const positionList: position[] = ['PIANO', 'SYNTH', 'VOCAL', 'DRUM', 'GUITAR', 'ETC']

  const [profileImage, setProfileImage] = useState<File | null>(null)
  const [data, setData] = useState<editMypage>({ accountId: '', aboutMe: '', position: [] })
  const [isUsernameChecked, setIsUsernameChecked] = useState<boolean>(true)
  const [isUsernameDuplicate, setIsUsernameDuplicate] = useState<boolean>(false)

  const queryClient = useQueryClient()

  const { mutate: changeProfileImg } = useChangeProfileImg(
    {
      onSuccess: () => {
        alert('프로필 이미지가 변경되었습니다.')
      },
      onError: () => alert('잠시 후 시도해주세요'),
    },
    profileImage as File,
  )

  const { mutate: editMypageMutate } = useEditMypage(
    {
      onSuccess: () => {
        navigator('/mypage')
        queryClient.invalidateQueries({ queryKey: ['user'] })
      },
      onError: () => alert('잠시 후 시도해주세요'),
    },
    data,
  )

  useEffect(() => {
    if (MyData) {
      setData({
        accountId: MyData.accountId || '',
        aboutMe: MyData.aboutMe || '',
        position: MyData.position || [],
      })
    }
  }, [MyData])

  const { mutate: duplicateCheck } = useDuplicateCheck(
    {
      onSuccess: () => {
        setIsUsernameChecked(true)
        setIsUsernameDuplicate(false)
      },
      onError: () => {
        setIsUsernameChecked(true)
        setIsUsernameDuplicate(true)
      },
    },
    data.accountId,
  )

  const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      setProfileImage(file)
    }
  }

  const getProfileImageSrc = () => {
    return profileImage ? URL.createObjectURL(profileImage) : MyData?.profile || Profile
  }

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    if (e.target.name === 'accountId') setIsUsernameChecked(false)
    setData((prev) => ({ ...prev, [e.target.name]: e.target.value }))
  }

  const togglePosition = (item: position) => {
    setData((prev) => ({
      ...prev,
      position: prev.position.includes(item) ? prev.position.filter((pos) => pos !== item) : [...prev.position, item],
    }))
  }

  useEffect(() => {
    if (profileImage) {
      changeProfileImg()
    }
  }, [profileImage])

  const isDisabled = !isUsernameChecked || isUsernameDuplicate || !data.accountId.trim() || data.position?.length === 0

  return (
    <Container>
      <Content>
        <img src={Banner} alt="배너" width="100%" height={160} />
        <TopBar>
          <ProfileImgWrap>
            <ProfileImg src={getProfileImageSrc()} alt="프로필" />
            <Label htmlFor="profile">
              <Plus width={20} height={20} Fill="white" />
            </Label>
            <AddProfile accept=".jpg, .jpeg, .png, .heic" type="file" id="profile" onChange={handleImageChange} />
          </ProfileImgWrap>
          <FeatureButton disabled={isDisabled} onClick={() => editMypageMutate()}>
            <Check Fill="#fff" />
            <p>완료</p>
          </FeatureButton>
        </TopBar>
        <ContentContainer>
          <ContentWrap>
            <p>
              닉네임 <Essential>*</Essential>
            </p>
            <NickName>
              <Input name="accountId" type="text" value={data.accountId} onChange={handleChange} />
              <Button disabled={MyData?.accountId === data.accountId} width={92} bigSize onClick={() => duplicateCheck()}>
                중복 확인
              </Button>
            </NickName>
            <Length>{data.accountId?.length || 0}/20 자</Length>
            {isUsernameDuplicate && <Length style={{ color: 'red' }}>이미 사용중인 닉네임입니다.</Length>}
          </ContentWrap>
          <ContentWrap>
            <p>
              포지션 <Essential>*</Essential>
            </p>
            <PositionWrap>
              {positionList.map((item) => (
                <Position key={item} $isActive={data.position.includes(item)} onClick={() => togglePosition(item)}>
                  {positionEnum[item]}
                </Position>
              ))}
            </PositionWrap>
          </ContentWrap>
          <ContentWrap>
            <p>설명</p>
            <Textarea name="aboutMe" value={data.aboutMe || ''} onChange={handleChange} />
            <Length>{data.aboutMe?.length || 0}/50 자</Length>
          </ContentWrap>
        </ContentContainer>
      </Content>
    </Container>
  )
}

const Position = styled.div<{ $isActive: boolean }>`
  ${({ theme }) => theme.font.body6}
  color: ${({ theme, $isActive }) => ($isActive ? theme.color.orange400 : '#000')};
  border: 1px solid ${({ theme, $isActive }) => ($isActive ? theme.color.orange100 : theme.color.gray200)};
  background-color: ${({ theme, $isActive }) => ($isActive ? theme.color.orange50 : theme.color.gray50)};
  padding: 4px 8px;
  border-radius: 6px;
  width: fit-content;
  cursor: pointer;
`

const Length = styled.p`
  color: ${({ theme }) => theme.color.gray400};
  ${({ theme }) => theme.font.body6}
  display: flex;
  align-self: end;
`

const Container = styled.div`
  margin: 0 auto;
  max-width: 1280px;
`

const ContentContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 40px;
  padding: 24px;
`

const NickName = styled.div`
  display: flex;
  gap: 8px;
`

const Content = styled.div`
  padding: 100px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
`

const ContentWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
`

const PositionWrap = styled.div`
  display: flex;
  gap: 8px;
  margin-bottom: 8px;
`

const Essential = styled.span`
  color: ${({ theme }) => theme.color.orange400};
`

const Textarea = styled.textarea.attrs({ maxLength: 50 })`
  padding: 10px 16px;
  border: 1px solid ${({ theme }) => theme.color.gray200};
  background-color: ${({ theme }) => theme.color.gray100};
  resize: none;
  width: 100%;
  height: 108px;
  border-radius: 6px;
`

const TopBar = styled.div`
  display: flex;
  justify-content: end;
  position: relative;
  padding: 10px 24px;
`

const FeatureButton = styled.button<{ disabled: boolean }>`
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 16px 16px 16px 12px;
  background-color: ${({ theme, disabled }) => (disabled ? theme.color.gray400 : theme.color.orange400)};
  border-radius: 8px;
  height: 40px;
  cursor: pointer;
  ${({ theme }) => theme.font.body3}
  color: #fff;
`

const ProfileImgWrap = styled.div`
  position: absolute;
  top: -60px;
  left: 24px;
  width: 120px;
  height: 120px;
`

const ProfileImg = styled.img`
  width: 100%;
  height: 100%;
  border-radius: 32px;
  border: 4px solid #fff;
  background-color: #fff;
`

const Label = styled.label`
  position: absolute;
  right: 0;
  bottom: 0;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background-color: ${({ theme }) => theme.color.gray300};
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 4px;
  outline: 2px solid white;
  cursor: pointer;
`

const AddProfile = styled.input`
  display: none;
`
