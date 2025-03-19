import { useState } from "react";
import styled from "styled-components";
import { SearchInput } from "../components/SearchInput";
import { Lock, PlusIcon, User } from "../assets";
import { Modal } from "../components/Modal";
import { CodeInput } from "../components/Code";
import { Input } from "../components/Input";
import { Participants } from "../components/Participants";
import { CustomRadioComponents } from "../components/Radio";

export const Room = () => {
    const [privateModal, setPrivateModal] = useState(false);
    const [roomOpen, setRoomOpen] = useState(false);
    const [participants, setParticipants] = useState(2);
    const [isPrivate, setIsPrivate] = useState(false);


    return (
        <Container>
            <Content>
                <Topbar>
                    <SearchContainer>
                        <SearchInput name="" value="" onChange={() => { }} placeholder="검색어를 입력해주세요" /> {/*api연동 시 수정 */}
                        <PlusButton onClick={() => setRoomOpen(true)}>
                            <img src={PlusIcon} width={28} height={28} alt="검색" />
                        </PlusButton>
                    </SearchContainer>
                    <Title>{99 /**api연동 */}개의 방</Title>
                </Topbar>
                <RoomList>
                    <RoomContent onClick={() => setPrivateModal(true)}>
                        <TitleWrap>
                            <TitleContainer>
                                <img src={Lock} alt="비공개" width={22} height={22} /> {/**api연동 시 수정 */}
                                <RoomTitle>룸 제목</RoomTitle>
                            </TitleContainer>
                            <Description>룸 설명</Description>
                        </TitleWrap>
                        <TotalWrap>
                            <img src={User} alt="사람" />
                            <TotalPeople>{participants}/5명</TotalPeople>
                        </TotalWrap>
                    </RoomContent>
                </RoomList>
                {privateModal && (
                    <Modal onClick={() => { /**api연동 시 연결 */ }} onClose={() => setPrivateModal(false)}>
                        <ModalContent>
                            <ModalTitleWrap>
                                <ModalTitle>{"걸어서 집으로" /**api연동 시 변경 */}</ModalTitle>
                                <ModalSubtitle>참여 코드를 입력해주세요</ModalSubtitle>
                            </ModalTitleWrap>
                            <CodeInput onComplete={() => { }} />
                        </ModalContent>
                    </Modal>
                )}
                {roomOpen && (
                    <Modal onClick={() => { }} onClose={() => setRoomOpen(false)}>
                        <ModalContent>
                            <ModalTitleWrap>
                                <ModalTitle>합주방 만들기</ModalTitle>
                                <ModalSubtitle>멤버를 모아 함께 음악을 만들어나가요</ModalSubtitle>
                            </ModalTitleWrap>
                            <ContentWrap>
                                <p>방 제목 <Essential>*</Essential></p> {/*api연동 시 수정 */}
                                <Input type="text" name="" value="" placeholder="제목을 입력해주세요" onChange={() => { }} />
                                <Length>0/50 자</Length>
                            </ContentWrap>
                            <ContentWrap>
                                <p>참여 인원 <Essential>*</Essential></p> {/*api연동 시 수정 */}
                                <Participants name="participants" value={participants} onChange={setParticipants} />
                                <LeftEx>최소 2명, 최대 5명</LeftEx>
                            </ContentWrap>
                            <ContentWrap>
                                <p>설명</p>
                                <Textarea placeholder="설명을 입력해주세요" />
                                <Length>{0/**추후 api연동 */}/100 자</Length>
                            </ContentWrap>
                            <RadioWrap>
                                <CustomRadioComponents
                                    name="roomType"
                                    id="public"
                                    value="public"
                                    label="공개"
                                    checked={!isPrivate}
                                    onChange={() => setIsPrivate(false)}
                                />
                                <CustomRadioComponents
                                    name="roomType"
                                    id="private"
                                    value="private"
                                    label="비공개"
                                    checked={isPrivate}
                                    onChange={() => setIsPrivate(true)}
                                />  </RadioWrap>
                            {isPrivate && (
                                <ContentWrap> {/*api연동 시 수정 */}
                                    <p>참여 코드 <Essential>*</Essential></p>
                                    <Input type="text" name="code" value="" placeholder="숫자 4자리 입력" onChange={() => { }} />
                                    <LeftEx>숫자 4글자를 조합해 작성해주세요.</LeftEx>
                                </ContentWrap>
                            )}
                        </ModalContent>
                    </Modal>
                )}
            </Content>
        </Container>
    );
};

const Textarea = styled.textarea.attrs({ maxLength: 100 })`
    padding: 10px 16px;
    border: 1px solid ${({ theme }) => theme.color.gray200};
    background-color: ${({ theme }) => theme.color.gray100};
    resize: none;
    width: 100%;
    height: 60px;
    border-radius: 6px;
    &::placeholder{
        color: ${({ theme }) => theme.color.gray300};
    }
`

const ModalContent = styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
    margin-bottom: 60px;
    max-height: 70dvh;
    overflow: auto;
`;

const Container = styled.div`
    margin: 0 auto;
    width: 1280px;
`;

const ModalTitleWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Content = styled.div`
    padding: 100px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 10px;
    width: 100%;
`;

const ContentWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const Topbar = styled.div`
    display: flex;
    flex-direction: column;
    gap: 68px;
`;

const SearchContainer = styled.div`
    display: flex;
    gap: 12px;
`;

const PlusButton = styled.button`
    background-color: ${({ theme }) => theme.color.orange400};
    padding: 14px;
    border-radius: 50%;
    width: 56px;
    height: 56px;
    cursor: pointer;
`;

const Essential = styled.span`
    color: ${({ theme }) => theme.color.orange400};
`

const Title = styled.h3`
    ${({ theme }) => theme.font.body4};
    color: ${({ theme }) => theme.color.gray400};
    margin-left: 20px;
`;

const RoomList = styled.div`
    display: flex;
    flex-direction: column;
`;

const RoomContent = styled.div`
    display: flex;
    justify-content: space-between;
    padding: 40px 24px;
    gap: 16px;
    &:hover {
        background-color: ${({ theme }) => theme.color.gray50};
    }
    border-bottom: 1px solid ${({ theme }) => theme.color.gray100};
`;

const RoomTitle = styled.h1`
    ${({ theme }) => theme.font.title3};
    color: #000;
`;

const Description = styled.p`
    ${({ theme }) => theme.font.body2};
    color: ${({ theme }) => theme.color.gray400};
`;

const TotalWrap = styled.div`
    display: flex;
    align-items: center;
`;

const TotalPeople = styled.p`
    ${({ theme }) => theme.font.body4};
    color: ${({ theme }) => theme.color.gray400};
`;

const TitleContainer = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const TitleWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 10px;
`;

const ModalTitle = styled.h1`
    ${({ theme }) => theme.font.title1};
    color: #000;
`;

const ModalSubtitle = styled.p`
    ${({ theme }) => theme.font.body6};
    color: ${({ theme }) => theme.color.gray500};
`;

const Length = styled.p`
    color: ${({ theme }) => theme.color.gray400};
    ${({ theme }) => theme.font.body6}
    display: flex;
    align-self: end;
`;
const LeftEx = styled.p`
    ${({ theme }) => theme.font.body6}
    color: ${({ theme }) => theme.color.gray400};
    width: 720px;
`

const RadioWrap = styled.div`
    display: flex;
    gap: 40px;
`
