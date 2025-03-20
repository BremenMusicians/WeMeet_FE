import styled from "styled-components"
import { LogOut, More, Warning } from "../assets"
import { useState } from "react"

interface UserVideoProps {
    owner?: boolean
}

export const UserVideo = ({ owner = false }: UserVideoProps) => {
    const [more, setMore] = useState<boolean>(false)

    return (
        <Container onClick={() => setMore(false)}> {/* 화면을 클릭하면 메뉴 닫힘 */}
            <NickNameContainer>
                {!!owner && (
                    <MoreButton onClick={(e) => { e.stopPropagation(); setMore(!more); }}>
                        <More Fill="#ffffff" />
                    </MoreButton>
                )}
                {more && (
                    <Option onClick={(e) => e.stopPropagation()}> {/* 메뉴 내부 클릭 시 닫히지 않음 */}
                        <OptionContent>
                            <img width={20} src={Warning} alt="신고" /> <p>신고하기</p>
                        </OptionContent>
                        <OptionContent>
                            <LogOut width={20} Fill="#A1A1AA" /> <p>내보내기</p>
                        </OptionContent>
                    </Option>
                )}
                <NickName>[드럼] 박수현</NickName>
            </NickNameContainer>
        </Container>
    )
}

const MoreButton = styled.div`
    padding: 0px 6px;
    background: rgba(0, 0, 0, 0.40);
    border-radius:6px;
    width: 36px;
    height: 36px;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    position: absolute;
    top: 16px;
    right: 16px;
`

const Container = styled.div`
    position: relative;
    width: 100%;
    height: 100%;
    border-radius: 16px;
    background-color: gray;
    max-width: 560px;
`

const OptionContent = styled.div`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 6px 4px;
    ${({ theme }) => theme.font.body6}
`

const Option = styled.div`
    display: flex;
    flex-direction: column;
    position: absolute;
    border-radius: 8px;
    background: rgba(0, 0, 0, 0.80);
    color: #fff;
    padding: 4px;
    gap: 2px;
    top: 64px;
    right: 16px;
    cursor: pointer;
`

const NickNameContainer = styled.div`
    display: flex;
    padding: 16px;
    align-items: end;
    width: 100%;
    height: 100%;
    position: relative;
`

const NickName = styled.p`
    width: fit-content;
    white-space: nowrap;
    height: fit-content;
    border-radius: 6px;
    background: rgba(0, 0, 0, 0.40);
    padding: 6px 10px;
    color: #fff;
`
