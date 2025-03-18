import styled from "styled-components"
import { Profile } from "../assets";// api연동시 기본 이미지 넘어오면 삭제
import React from "react";

interface ProfileCard {
    name: string;
    introduce: string;
    position: string[]; // api 연동 시 enum으로 수정
    profileImg?: string;
    children: React.ReactNode
}

export const ProfileCard = ({ name, introduce, position, profileImg, children }: ProfileCard) => {

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
            {children}
        </ProfileContainer>
    )
}

const ProfileContainer = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: relative;
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
