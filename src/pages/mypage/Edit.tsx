import styled from "styled-components";
import { Input } from "../../components/Input";
import { Banner, Check, Plus, Profile } from "../../assets";
import React, { useEffect, useState } from "react";
import { Button } from "../../components/Button";
import { useDuplicateCheck, useEditMypage, useGetMyInformation } from "../../apis/user";
import { editMypage, position, positionEnum } from "../../apis/user/type";
import { useNavigate } from "react-router-dom";

export const EditMyPage = () => {
    const navigator = useNavigate();
    const { data: MyData } = useGetMyInformation();
    const positionList: position[] = ["PIANO", "SYNTH", "VOCAL", "DRUM", "GUITAR", "ETC"];
    
    const [profileImage, setProfileImage] = useState<string | null>(null);
    const [data, setData] = useState<editMypage>({ accountId: "", aboutMe: "", position: [] });
    const [duplicate, setDuplicate] = useState<boolean | null>(null);
    
    useEffect(() => {
        if (MyData) {
            setData({
                accountId: MyData.accountId || "",
                aboutMe: MyData.aboutMe || "",
                position: MyData.position || [],
            });
        }
    }, [MyData]);
    
    const { mutate: duplicateCheck } = useDuplicateCheck({
        onSuccess: () => setDuplicate(false),
        onError: () => setDuplicate(true)
    }, data.accountId);
    
    const { mutate: editMypageMutate } = useEditMypage({
        onSuccess: () => navigator('/mypage'),
        onError: () => alert("잠시 후 시도해주세요")
    }, data);
    
    const handleImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => setProfileImage(reader.result as string);
            reader.readAsDataURL(file);
        }
    };
    
    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    };
    
    const togglePosition = (item: position) => {
        setData(prev => ({
            ...prev,
            position: prev.position.includes(item) 
                ? prev.position.filter(pos => pos !== item) 
                : [...prev.position, item]
        }));
    };
    
    const isDisabled = duplicate !== false || !data.accountId.trim() || data.position.length === 0;
    
    return (
        <Container>
            <Content>
                <img src={Banner} alt="배너" width="100%" height={160} />
                <TopBar>
                    <ProfileImgWrap>
                        <ProfileImg src={profileImage || Profile} alt="프로필" />
                        <Label htmlFor="profile">
                            <img src={Plus} alt="프로필 변경" />
                        </Label>
                        <AddProfile type="file" id="profile" onChange={handleImageChange} />
                    </ProfileImgWrap>
                    <FeatureButton disabled={isDisabled} onClick={() => editMypageMutate()}>
                        <Check Fill="#fff" />
                        <p>완료</p>
                    </FeatureButton>
                </TopBar>
                <ContentContainer>
                    <ContentWrap>
                        <p>닉네임 <Essential>*</Essential></p>
                        <NickName>
                            <Input name='accountId' type="text" value={data.accountId} onChange={handleChange} />
                            <Button width={92} bigSize onClick={() => duplicateCheck()}>중복 확인</Button>
                        </NickName>
                        <Length>{data.accountId?.length || 0}/20 자</Length>
                        {duplicate && <Length style={{color:"red"}}>이미 사용중인 닉네임입니다.</Length>}
                    </ContentWrap>
                    <ContentWrap>
                        <p>포지션 <Essential>*</Essential></p>
                        <PositionWrap>
                            {positionList.map(item => (
                                <Position
                                    key={item}
                                    $isActive={data.position.includes(item)}
                                    onClick={() => togglePosition(item)}
                                >
                                    {positionEnum[item]}
                                </Position>
                            ))}
                        </PositionWrap>
                    </ContentWrap>
                    <ContentWrap>
                        <p>설명</p>
                        <Textarea name="aboutMe" value={data.aboutMe || ''} onChange={handleChange} />
                        <Length>{data.aboutMe?.length || 0}/50 자</Length>
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
    max-width: 1280px;
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

const Textarea = styled.textarea.attrs({ maxLength: 50 })`
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

const FeatureButton = styled.button<{disabled: boolean}>`
    display: flex;
    align-items: center;
    gap: 10px;
    padding: 16px 16px 16px 12px;
    background-color: ${({ theme, disabled }) => disabled ? theme.color.gray400 : theme.color.orange400};
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
