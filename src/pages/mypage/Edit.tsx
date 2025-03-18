import styled from "styled-components"
import { PositionType } from "../../utils/type"
import { Input } from "../../components/Input"
import { Banner, Check, Plus, Profile } from "../../assets"
import { useState } from "react"
import { Button } from "../../components/Button"

export const EditMyPage = () => {
    const positionList: PositionType[] = ["피아노", "신스", "보컬", "드럼", "기타", "그 외"];
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [selectedPosition, setSelectedPosition] = useState<string | null>(null);

    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setProfileImage(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    return (
        <Container>
            <Content>
                <img src={Banner} alt="배너" width={1232} height={160} />
                <TopBar>
                    <ProfileImgWrap>
                        <ProfileImg src={profileImage || Profile} alt="프로필" />
                        <Label htmlFor="profile">
                            <img src={Plus} alt="프로필 변경" />
                        </Label>
                        <AddProfile type="file" id="profile" onChange={handleImageChange} />
                    </ProfileImgWrap>
                    <FeatureButton>
                        <img src={Check} alt="완료" />
                        <p>완료</p>
                    </FeatureButton>
                </TopBar>
                <ContentContainer>
                    <ContentWrap>
                        <p>닉네임 <Essential>*</Essential></p>
                        <NickName>
                            <Input name="" type="text" value="" onChange={() => { }} />
                            <Button width={92} bigSize onClick={() => { }}>중복 확인</Button>
                        </NickName>
                        <Length>1/20 자</Length>
                    </ContentWrap>
                    <ContentWrap>
                        <p>포지션 <Essential>*</Essential></p> {/**일단 중복선택 불가능하게 하고 나중에 api연동 시 추가 */}
                        <PositionWrap>
                            {positionList.map((item) => (
                                <Position
                                    key={item}
                                    $isActive={selectedPosition === item}
                                    onClick={() => setSelectedPosition(item)}
                                >
                                    {item}
                                </Position>
                            ))}
                        </PositionWrap>
                    </ContentWrap>
                    <ContentWrap>
                        <p>설명</p>
                        <Textarea />
                        <Length>0/50 자</Length>
                    </ContentWrap>
                </ContentContainer>
            </Content>
        </Container>
    );
};

const Position = styled.div<{ $isActive: boolean }>`
    ${({ theme }) => theme.font.body6}
    color: ${({ theme, $isActive }) => ($isActive ? theme.color.orange400 : "#000")};
    border: 1px solid ${({ theme, $isActive }) => ($isActive ? theme.color.orange100 : theme.color.gray200)};
    background-color: ${({ theme, $isActive }) => ($isActive ? theme.color.orange50 : theme.color.gray50)};
    padding: 4px 8px;
    border-radius: 6px;
    width: fit-content;
    cursor: pointer;
`;

const Length = styled.p`
    color: ${({ theme }) => theme.color.gray400};
    ${({ theme }) => theme.font.body6}
    display: flex;
    align-self: end;
`;

const Container = styled.div`
    margin: 0 auto;
    width: 1280px;
`

const ContentContainer = styled.div`
    display: flex;
    flex-direction: column;
    gap: 40px;
    padding: 24px;
`

const NickName = styled.div`
    display: flex;
    gap: 8px;
`

const Content = styled.div`
    padding: 100px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
`

const ContentWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`

const PositionWrap = styled.div`
    display: flex;
    gap: 8px;
    margin-bottom: 8px;
`

const Essential = styled.span`
    color: ${({ theme }) => theme.color.orange400};
`

const Textarea = styled.textarea`
    padding: 10px 16px;
    border: 1px solid ${({ theme }) => theme.color.gray200};
    background-color: ${({ theme }) => theme.color.gray100};
    resize: none;
    width: 100%;
    height: 108px;
    border-radius: 6px;
`

const TopBar = styled.div`
    display: flex;
    justify-content: end;
    position: relative;
    padding: 10px 24px;
`

const FeatureButton = styled.button`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 16px 16px 12px;
    background-color: ${({ theme }) => theme.color.orange400};
    border-radius: 8px;
    height: 40px;
    cursor: pointer;
    ${({ theme }) => theme.font.body3}
    color: #fff;
`

const ProfileImgWrap = styled.div`
    position: absolute;
    top: -60px;
    left: 24px;
    width: 120px;
    height: 120px;
`;

const ProfileImg = styled.img`
    width: 100%;
    height: 100%;
    border-radius: 32px;
    border: 4px solid #fff;
    background-color: #fff;
`;

const Label = styled.label`
    position: absolute;
    right: 0; 
    bottom: 0;
    width: 32px;
    height: 32px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.color.gray100}; 
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
`;

const AddProfile = styled.input`
    display: none;
`;
