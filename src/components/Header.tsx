import styled from "styled-components"
import { Letters_Logo, Profile } from "../assets"
import { Tab } from "./Tab"
import { useLocation, useNavigate } from "react-router-dom"
import { Button } from "./Button"
import { cookie } from "../utils/Auth"

export const Header = () => {
    const routerList = [{
        router: '/main',
        name: "메인"
    },
    {
        router: '/instrument',
        name: '가상악기'
    },
    {
        router: '/friend',
        name: '친구'
    }]

    const location = useLocation();
    const router = useNavigate();

    const isLogin = cookie.get("access_token");

    return (
        <HeaderContainer>
            <Box>
                <LeftContainer>
                    <LogoImg src={Letters_Logo} alt="로고" onClick={() => router('/')} />
                    <FlexBox>
                        {routerList.map((item) => (
                            <Tab
                                isActive={location.pathname === item.router}
                                key={item.name}
                                name={item.name}
                                onClick={() => router(`${item.router}`)}
                            />
                        ))}
                    </FlexBox>
                </LeftContainer>

                {isLogin ? (
                    <ProfileContainer onClick={() => router('/mypage')}>
                        <ProfileImg src={Profile} alt="프로필" />
                        <Nickname>닉네임</Nickname>
                    </ProfileContainer>
                ) : (
                    <RightContainer>
                        <LoginButton onClick={() => router('/login')}>로그인</LoginButton>
                        <Button onClick={() => router('/signin')}>회원가입</Button>
                    </RightContainer>
                )}
            </Box>
        </HeaderContainer>
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
`;

const LogoImg = styled.img`
    cursor: pointer;
`;

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
`;

const ProfileContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
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

