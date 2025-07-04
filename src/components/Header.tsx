import styled from 'styled-components'
import { Letters_Logo, LogOut, Profile } from '../assets'
import { Tab } from './Tab'
import { useLocation, useNavigate } from 'react-router-dom'
import { Button } from './Button'
import { cookie } from '../utils/Auth'
import { useUserQuery } from '../apis/user'
import { useUserStore } from '../stores/UserStores'
import { useEffect, useState } from 'react'
import { Modal } from './Modal'

export const Header = () => {
  const setUser = useUserStore((state) => state.setUser)
  const user = useUserStore((state) => state.user)
  const [modal, setModal] = useState<boolean>(false)

  const routerList = [
    {
      router: '/main',
      name: '메인',
    },
    {
      router: '/instrument?name=피아노',
      name: '가상악기',
    },
    {
      router: '/friend',
      name: '친구',
    },
    {
      router: '/chat',
      name: '채팅',
    },
  ]

  const location = useLocation()
  const router = useNavigate()

  const isLogin: boolean = cookie.get('access_token')
  const { data } = useUserQuery(!!isLogin)

  useEffect(() => {
    if (data) {
      setUser(data)
    }
  }, [data, setUser])

  return (
    <>
      <HeaderContainer>
        <Box>
          <LeftContainer>
            <LogoImg src={Letters_Logo} alt="로고" onClick={() => router('/')} />
            <FlexBox>
              {routerList.map((item) => (
                <Tab isActive={location.pathname === item.router.slice(0, 11)} key={item.name} name={item.name} onClick={() => router(`${item.router}`)} />
              ))}
            </FlexBox>
          </LeftContainer>

          {isLogin ? (
            <ProfileWrap>
              <ProfileContainer onClick={() => router('/mypage')}>
                <ProfileImg src={user?.profile || Profile} alt="프로필" style={{ border: '1px solid #d9d9d9 ' }} />
                <Nickname>{user?.accountId}</Nickname>
              </ProfileContainer>
              <button style={{ backgroundColor: 'transparent' }} onClick={() => setModal((prev) => !prev)}>
                <LogOut Fill="#a1a1aa" />
              </button>
            </ProfileWrap>
          ) : (
            <RightContainer>
              <LoginButton onClick={() => router('/login')}>로그인</LoginButton>
              <Button onClick={() => router('/signup')}>회원가입</Button>
            </RightContainer>
          )}
        </Box>
      </HeaderContainer>
      {modal && (
        <Modal
          onClick={() => {
            setModal(false)
            cookie.remove('access_token')
            cookie.remove('refresh_token')
            window.location.href = '/'
          }}
          onClose={() => setModal(false)}
        >
          <LogoutMent>로그아웃 하시겠습니까?</LogoutMent>
        </Modal>
      )}
    </>
  )
}

const HeaderContainer = styled.div`
  margin: 0 auto;
  position: fixed;
  padding: 0px 24px;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 10;
  border-bottom: 1px solid ${({ theme }) => theme.color.gray200};
  background-color: #fff;
`

const LogoImg = styled.img`
  cursor: pointer;
`

const Nickname = styled.p`
  ${({ theme }) => theme.font.body4}
`

const ProfileImg = styled.img`
  width: 44px;
  height: 44px;
  border-radius: 50%;
`

const Box = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  width: 100%;
  max-width: 1280px;
  margin: 0 auto;
  padding: 8px 0px;
`

const ProfileContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  cursor: pointer;
`

const LeftContainer = styled.div`
  display: flex;
  gap: 24px;
`

const FlexBox = styled.div`
  display: flex;
`

const RightContainer = styled.div`
  display: flex;
  gap: 12px;
  align-items: center;
  width: 182px;
`

const LoginButton = styled.button`
  color: ${({ theme }) => theme.color.orange400};
  background-color: #fff;
  padding: 10px 20px;
  cursor: pointer;
  border-radius: 6px;
  width: 100%;
`

const LogoutMent = styled.h2`
  margin: 20px 0px;
  ${({ theme }) => theme.font.header2}
`

const ProfileWrap = styled.div`
  display: flex;
  gap: 20px;
  align-items: center;
`
