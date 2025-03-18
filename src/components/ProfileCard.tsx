import styled from "styled-components"
import { Accept, AddFriend, Chat, More, Profile, Refusal } from "../assets";// api연동시 기본 이미지 넘어오면 삭제
import { useState } from "react";
import { DeleteFriend } from "./DeleteFriend";

interface ProfileCard {
    type: "add" | "accept" | "chat"
    name: string;
    introduce: string;
    position: string[]; // api 연동 시 enum으로 수정
    profileImg?: string;
    onClick: () => void;
    onClickEvent?: () => void
}

export const ProfileCard = ({ type, name, introduce, position, profileImg, onClick, onClickEvent }: ProfileCard) => {
    const [deleteFriend, setDeleteFriend] = useState<boolean>(false);

    const handleDeleteFriend = () => {
        setDeleteFriend(false)
        //api연동
    }

    return (
        <ProfileContainer>
            <Flex>
                <ProfileImg src={profileImg || Profile} alt="프로필" />
                <Column>
                    <Flex>
                        <Name>{name}</Name>
                        {position?.map((item) => (
                            <PositionBadge key={item}>{item}</PositionBadge>
                        ))}
                    </Flex>
                    <Introduce>{introduce}</Introduce>
                </Column>
            </Flex>
            {type === "add" && <ClickOption src={AddFriend} onClick={onClick} />}
            {type === "accept" && onClickEvent &&
                <RightContainer>
                    <ClickOption src={Accept} onClick={onClick} />
                    <ClickOption src={Refusal} onClick={onClickEvent} />
                </RightContainer>}
            {type === "chat" && <RightContainer>
                <ClickOption src={Chat} onClick={onClick} />
                <MoreIcon src={More} onClick={() => setDeleteFriend(true)} />
                {deleteFriend && <DeleteFriend onClick={handleDeleteFriend} />}
            </RightContainer>}
        </ProfileContainer>
    )
}

const ProfileContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
`

const ClickOption = styled.img`
    width: 44px;
    height: 44px;
    cursor: pointer;
`
const Flex = styled.div`
    display: flex;
    gap: 8px;
    align-items: center;
`

const PositionBadge = styled.div`
    color: ${({ theme }) => theme.color.gray400};
    background-color: ${({ theme }) => theme.color.gray50};
    border: 1px solid ${({ theme }) => theme.color.gray200};
    border-radius: 4px;
    padding: 4px 6px;
    width: fit-content;
    height: fit-content;
`

const Column = styled.div`
    display: flex;
    flex-direction: column;
    gap: 4px;
`

const Introduce = styled.p`
    ${({ theme }) => theme.font.body4}
    color: ${({ theme }) => theme.color.gray400};
`

const Name = styled.h3`
    ${({ theme }) => theme.font.body2}
`

const ProfileImg = styled.img`
    border-radius: 24px;
    width: 68px;
    height: 68px;
    border: 1px solid ${({ theme }) => theme.color.gray100};
`

const RightContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 16px;
    justify-content: space-between;
`

const MoreIcon = styled.img`
    width: 24px;
    height: 24px;
    cursor: pointer;
    margin-left: auto; 
`;
