import styled from 'styled-components'
import { Profile } from '../assets'
import React from 'react'
import { position, positionEnum } from '../apis/user/type'

interface ProfileCard {
  name: string
  introduce: string | null
  position: position[]
  profileImg?: string
  children?: React.ReactNode
  chat?: boolean
}

export const ProfileCard = ({ name, introduce, position, profileImg, children, chat = false }: ProfileCard) => {
  return (
    <ProfileContainer>
      <Flex>
        <ProfileImg src={profileImg || Profile} alt="프로필" />
        <Column>
          <Flex>
            <Name chat={chat}>{name}</Name>
            {!chat && position?.map((item) => <PositionBadge key={item}>{positionEnum[item]}</PositionBadge>)}
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
  overflow: hidden;
`

const Column = styled.div`
  display: flex;
  flex-direction: column;
  gap: 4px;
`

const Introduce = styled.p`
  ${({ theme }) => theme.font.body4}
  color: ${({ theme }) => theme.color.gray400};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  width: 235px;
  text-align: start;
`

const Name = styled.h3<{ chat?: boolean }>`
  ${({ theme }) => theme.font.body2}
  overflow:hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
  max-width: ${({ chat }) => (chat ? '235px' : '100%')};
`

const ProfileImg = styled.img`
  border-radius: 24px;
  width: 68px;
  height: 68px;
  border: 1px solid ${({ theme }) => theme.color.gray100};
`
