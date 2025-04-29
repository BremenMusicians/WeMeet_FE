import styled from 'styled-components'
import { Toggle } from '../components/Toggle'
import { useState, useEffect } from 'react'
import { SearchInput } from '../components/SearchInput'
import { ProfileCard } from '../components/ProfileCard'
import { Accept, AddFriend, Refusal } from '../assets'
import { useChangeFriend, useFriendRequest, useGetRecommendFriendList, useGetRequestFriendList } from '../apis/friends'
import { useInView } from 'react-intersection-observer'
import useDebounce from '../hooks/useDebounce'

export const Friend = () => {
  const [currentMenu, setCurrentMenu] = useState<'recommend' | 'request'>('recommend')
  const [searchKeyword, setSearchKeyword] = useState('')
  const debouncedSearchText = useDebounce(searchKeyword, 300)
  const [requestedIds, setRequestedIds] = useState<string[]>([])

  const { ref, inView } = useInView()
  const { data, fetchNextPage, hasNextPage, isFetchingNextPage, isLoading } = useGetRecommendFriendList(debouncedSearchText)
  const { data: requestList, refetch: refetchlist } = useGetRequestFriendList()
  const { mutate: handleAddFriend } = useFriendRequest()
  const { mutate: changeFriendStatus } = useChangeFriend({
    onSuccess: () => {
      refetchlist()
    },
  })

  const handleAccept = (friendId: string) => {
    changeFriendStatus({ friendId, accept: true })
  }

  const handleRefusal = (friendId: string) => {
    changeFriendStatus({ friendId, accept: false })
  }

  useEffect(() => {
    if (inView && hasNextPage) {
      fetchNextPage()
    }
  }, [inView, hasNextPage, fetchNextPage])

  return (
    <Container>
      <Content>
        <TopBar>
          <Toggle onChange={setCurrentMenu} />
          {currentMenu === 'recommend' && <SearchInput placeholder="검색어를 입력해주세요" onChange={(e) => setSearchKeyword(e.target.value)} name="search" value={searchKeyword} width={640} />}
        </TopBar>

        <List>
          <p>{currentMenu === 'request' ? `받은 친구 요청 (${requestList?.length ?? 0}명)` : `추천 친구 (${data?.pages?.[0]?.usersCnt ?? 0}명)`}</p>

          <ListWrap>
            {currentMenu === 'recommend'
              ? data?.pages
                  .flatMap((page) => page.users)
                  .map((item) => (
                    <ProfileCard key={item.accountId} name={item.accountId} introduce={item.aboutMe} position={item.position} profileImg={item.profile!}>
                      {item.isFriend === 'NOT_FRIEND' && (
                        <ClickOption
                          hidden={requestedIds.includes(item.accountId)}
                          src={AddFriend}
                          onClick={() =>
                            handleAddFriend(item.accountId, {
                              onSuccess: () => {
                                setRequestedIds((prev) => [...prev, item.accountId])
                              },
                            })
                          }
                        />
                      )}
                    </ProfileCard>
                  ))
              : requestList?.map((item) => (
                  <ProfileCard key={item.accountId} name={item.accountId} introduce={item.aboutMe} position={item.position} profileImg={item.profile!}>
                    <RightContainer>
                      <ClickOption src={Accept} onClick={() => handleAccept(item.friendId)} />
                      <ClickOption src={Refusal} onClick={() => handleRefusal(item.friendId)} />
                    </RightContainer>
                  </ProfileCard>
                ))}

            {currentMenu === 'request' && (requestList?.length ?? 0) < 1 && <P>친구 요청이 없습니다.</P>}
            {currentMenu === 'recommend' && (data?.pages?.[0]?.users?.length ?? 0) < 1 && <P>해당 친구가 존재하지 않습니다.</P>}
            {currentMenu === 'recommend' && !isLoading && <ScrollObserver ref={ref} />}
            {isFetchingNextPage && <P>불러오는 중...</P>}
          </ListWrap>
        </List>
      </Content>
    </Container>
  )
}

const RightContainer = styled.div`
  display: flex;
  align-items: center;
  gap: 16px;
  justify-content: space-between;
`

const ClickOption = styled.img<{ hidden?: boolean }>`
  width: 44px;
  cursor: pointer;
  display: ${({ hidden }) => (hidden ? 'none' : 'inline')};
`

const Container = styled.div`
  margin: 0 auto;
  max-width: 1280px;
`

const Content = styled.div`
  padding: 100px 24px 24px 24px;
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
`

const TopBar = styled.div`
  display: flex;
  width: 100%;
  justify-content: space-between;
  align-items: center;
  gap: 20px;
`

const List = styled.div`
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 40px 24px 24px 24px;
`

const ListWrap = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
  overflow-y: scroll;
`

const P = styled.h2`
  ${({ theme }) => theme.font.body2}
  display: flex;
  width: 100%;
  height: 60dvh;
  justify-content: center;
  align-items: center;
  color: ${({ theme }) => theme.color.gray400};
`

const ScrollObserver = styled.div`
  height: 1px;
`
