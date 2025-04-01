import styled from "styled-components"
import { Banner, Chat, EditPencil, More, Profile, UserAdd } from "../../assets"
import { SearchInput } from "../../components/SearchInput"
import { ProfileCard } from "../../components/ProfileCard"
import { useNavigate } from "react-router-dom"
import { DeleteFriend } from "../../components/DeleteFriend"
import { useEffect, useRef, useState } from "react"
import { positionEnum } from "../../apis/user/type"
import { ClipLoader } from 'react-spinners'
import { useGetMyInformation } from "../../apis/user"

export const MyPage = () => {  
    const { data, isLoading } = useGetMyInformation()
    const [searchTerm, setSearchTerm] = useState<string>("");
    const deleteRef = useRef<HTMLDivElement>(null);
    const [visibleDelete, setVisibleDelete] = useState<{ [key: string]: boolean }>({});

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (
                deleteRef.current &&
                !deleteRef.current.contains(event.target as Node)
            ) {
                setVisibleDelete(prev => Object.fromEntries(Object.keys(prev).map(key => [key, false])));
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);

    const router = useNavigate();

    const handleSearchChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setSearchTerm(event.target.value);
    }

    const filteredFriends = data?.friends?.filter(friend => 
        friend.accountId.toLowerCase().includes(searchTerm.toLowerCase()) ||
        friend.aboutMe?.toLowerCase().includes(searchTerm.toLowerCase())
    ) || [];

    const handleDeleteToggle = (accountId: string) => {
        setVisibleDelete(prev => ({
            ...Object.fromEntries(Object.keys(prev).map(key => [key, false])),
            [accountId]: !prev[accountId], 
        }));
    };

    if (isLoading) return <ClipLoader color="#F55219" />;

    return (
        <Container>
            <Content>
                <img src={Banner} alt="배너" width="100%" height={160} />
                <TopBar>
                    <ProfileImg src={data?.profile || Profile} width={120} alt="프로필" />
                    <ButtonWrap>
                        <FeatureButton onClick={() => router('/friend')}><img src={UserAdd} alt="유저추가" /><p>친구 추가</p></FeatureButton>
                        <FeatureButton onClick={() => router('edit')}><img src={EditPencil} alt="편집" /><p>편집</p></FeatureButton>
                    </ButtonWrap>
                </TopBar>
                <Title>
                    <Flex>
                        <NickName>{data?.accountId}</NickName>
                        <ButtonWrap>
                            {data?.position?.map((item) => ( 
                                <Position key={item}>{positionEnum[item]}</Position>
                            ))}
                        </ButtonWrap>
                    </Flex>
                    <Introduce>{data?.aboutMe}</Introduce>
                </Title>
                <FriendContent>
                    <FriendTopBar>
                        <p>{data?.friendsCnt}명의 친구</p>
                        <SearchInput width={480} placeholder="검색어를 입력해주세요" name="search" value={searchTerm} onChange={handleSearchChange} />
                    </FriendTopBar>
                    {filteredFriends.map((item) => (
                        <ProfileCard key={item.accountId} name={item.accountId} introduce={item.aboutMe} position={item.position}>
                            <RightContainer>
                                <ClickOption src={Chat} onClick={() => { }} />
                                <div ref={deleteRef}><More Fill="#A1A1AA" onClick={() => handleDeleteToggle(item.accountId)} /></div>
                                {visibleDelete[item.accountId] && <DeleteFriend onClick={() => { }} />} {/* 삭제 버튼 표시 */}
                            </RightContainer>
                        </ProfileCard>
                    ))}
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
    max-width: 1280px;
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
