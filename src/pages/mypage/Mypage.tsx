import styled from "styled-components"
import { Banner, Chat, EditPencil, More, Profile, UserAdd } from "../../assets"
import { SearchInput } from "../../components/SearchInput"
import { ProfileCard } from "../../components/ProfileCard"
import { useNavigate } from "react-router-dom"
import { DeleteFriend } from "../../components/DeleteFriend"
import { useState } from "react"

export const MyPage = () => {

    const position = ['드럼', '피아노']
    const [deleteFriend, setDeleteFriend] = useState<boolean>(false);


    const router = useNavigate();

    return (
        <Container>
            <Content>
                <img src={Banner} alt="배너" width={1232} height={160} />
                <TopBar>
                    <ProfileImg src={Profile} width={120} alt="" />
                    <ButtonWrap>
                        <FeatureButton onClick={() => router('/friend')}><img src={UserAdd} alt="유저추가" /><p>친구 추가</p></FeatureButton>
                        <FeatureButton onClick={() => router('edit')}><img src={EditPencil} alt="편집" /><p>편집</p></FeatureButton>
                    </ButtonWrap>
                </TopBar>
                <Title>
                    <Flex>
                        <NickName>위밋</NickName>
                        <ButtonWrap>
                            {position.map((item) => (
                                <Position key={item}>{item}</Position>
                            ))}
                        </ButtonWrap>
                    </Flex>
                    <Introduce>소개글 햄부기부기햄ㅂㅜ기</Introduce>
                </Title>
                <FriendContent>
                    <FriendTopBar>
                        <p>{100/**api연동 */}명의 친구</p>
                        <SearchInput width={480} placeholder="검색어를 입력해주세요" name="" value="" onChange={() => { }} />{/**api연동 시 수정 */}
                    </FriendTopBar>
                    <ProfileCard name="햄부기" introduce="햄버거 먹고싶다" position={['드럼', '신스']}>
                        <RightContainer>
                            <ClickOption src={Chat} onClick={() => { }} />
                            <More Fill="#A1A1AA" onClick={() => setDeleteFriend(true)} />
                            {deleteFriend && <DeleteFriend onClick={() => { }} />} {/**api연동 */}
                        </RightContainer>
                    </ProfileCard>
                </FriendContent>
            </Content>
        </Container>
    )
}

const ClickOption = styled.img`
    width: 44px;
    height: 44px;
    cursor: pointer;
`

const RightContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: space-between;
`

const Container = styled.div`
    margin: 0 auto;
    width: 1280px;
`

const Content = styled.div`
    padding: 100px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
`

const TopBar = styled.div`
    display: flex;
    justify-content: end;
    position: relative;
    padding: 10px 24px;
`

const ProfileImg = styled.img`
    width: 120px;
    height: 120px;
    border: 4px solid #fff;
    border-radius: 32px;
    position: absolute;
    top: -60px;
    left: 24px;
    background-color: #fff;
`

const ButtonWrap = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`

const FeatureButton = styled.button`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 16px 16px 12px;
    background-color: ${({ theme }) => theme.color.gray100};
    border: 1px solid ${({ theme }) => theme.color.gray200};
    border-radius: 8px;
    height: 40px;
    cursor: pointer;
    ${({ theme }) => theme.font.body3}
    color: ${({ theme }) => theme.color.gray500};
`

const Title = styled.div`
    display: flex;
    flex-direction: column;
    gap: 12px;
    padding: 0px 24px;
`

const NickName = styled.h1`
    ${({ theme }) => theme.font.header3}
    color: #000;
`

const Position = styled.div`
    ${({ theme }) => theme.font.body6}
    color: ${({ theme }) => theme.color.orange400};
    border: 1px solid ${({ theme }) => theme.color.orange100};
    background-color: ${({ theme }) => theme.color.orange50};
    padding: 4px 8px;
    border-radius: 6px;
    width: fit-content;
`

const Introduce = styled.p`
    ${({ theme }) => theme.font.body4};
    color: ${({ theme }) => theme.color.gray400};
`

const Flex = styled.div`
    display: flex;
    gap: 16px;
    align-items: center;
`

const FriendContent = styled.div`
    padding: 24px;
    display: flex;
    flex-direction: column;
    gap: 20px;
`

const FriendTopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: end;
`