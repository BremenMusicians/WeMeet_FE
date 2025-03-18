import styled from "styled-components";
import { Toggle } from "../components/Toggle";
import { useState } from "react";
import { SearchInput } from "../components/SearchInput";
import { ProfileCard } from "../components/ProfileCard";
import { Accept, AddFriend, Refusal } from "../assets";

export const Friend = () => {
    const [currentMenu, setCurrentMenu] = useState<'recommend' | 'request'>('recommend');

    const data = [
        { id: 1, name: '박수현', introduce: '어쩔ㄹㄹㄹ', position: ['신스'], status: 'not' },
        { id: 2, name: '박수현', introduce: '어쩔ㄹㄹㄹ', position: ['신스'], status: 'standby' },
        { id: 3, name: '박수현', introduce: '어쩔ㄹㄹㄹ', position: ['신스'], status: 'not' },
    ];

    // 친구 요청 수락
    const handleAccept = () => {
        // API 요청 추가
    };

    // 친구 요청 거절
    const handleRefusal = () => {
        // API 요청 추가
    };

    // 친구 추가
    const handleAddFriend = () => {
        //API 요청 추가
    };

    // 메시지 보내기
    const handleSendMessage = () => {
        //채팅 페이지 이동 or API 요청 추가
    };

    return (
        <Container>
            <Content>
                <TopBar>
                    <Toggle onChange={setCurrentMenu} />
                    <SearchInput placeholder="검색어를 입력해주세요" onChange={() => { }} name="search" value="" width={640} />
                </TopBar>
                <List>
                    <p>{currentMenu === "request" ? "받은 친구 요청" : "추천 친구"} ({data.length}명)</p>
                    <ListWrap>
                        {data?.map((item) => (
                            <ProfileCard key={item.id} name={item.name} introduce={item.introduce} position={item.position} profileImg="">
                                {currentMenu === "request" ? (
                                    <RightContainer>
                                        <ClickOption src={Accept} onClick={() => handleAccept()} />
                                        <ClickOption src={Refusal} onClick={() => handleRefusal()} />
                                    </RightContainer>
                                ) : (
                                    (
                                        <ClickOption
                                            src={item.status === "not" ? AddFriend : undefined}
                                            onClick={() => handleAddFriend}
                                        />
                                    )
                                )}
                            </ProfileCard>
                        ))}
                        {currentMenu === "request" && data.length === 0 &&
                            <P>친구 요청이 없습니다.</P>}
                    </ListWrap>
                </List>
            </Content>
        </Container>
    );
};

const RightContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: space-between;
`;

const ClickOption = styled.img`
    width: 44px;
    cursor: pointer;
`;

const Container = styled.div`
    margin: 0 auto;
    width: 1280px;
`;

const Content = styled.div`
    padding: 100px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`;

const TopBar = styled.div`
    display: flex;
    width: 100%;
    justify-content: space-between;
    align-items: center;
`;

const List = styled.div`
    display: flex;
    flex-direction: column;
    gap: 20px;
    padding: 40px 24px 24px 24px;
`;

const ListWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 16px;
`;

const P = styled.h2`
    ${({ theme }) => theme.font.body2}
    display: flex;
    width: 100%;
    height: 60dvh;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.color.gray400};
`