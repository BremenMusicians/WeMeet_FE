import styled from "styled-components"
import { InstrumentType } from "../utils/type"
import { Check, Drum, Guitar, Piano, Slider } from "../assets"

interface InstrumentListProps {
    activeInstrument?: InstrumentType
}

const instrumentList: InstrumentType[] = ['피아노', '드럼', '신스', '기타']

const iconMap = {
    "피아노": Piano,
    "기타": Guitar,
    "드럼": Drum,
    "신스": Slider
}

export const InstrumentList = ({ activeInstrument }: InstrumentListProps) => {
    return (
        <Container>
            {instrumentList.map((item) => {
                const Icon = iconMap[item]
                const isActive = activeInstrument === item

                return (
                    <InstrumentWrap key={item} $isActive={isActive}>
                        <InstrumentLeft>
                            <Icon Fill={isActive ? "#F75C3C" : "#A1A1AA"} />
                            <p>{item}</p>
                        </InstrumentLeft>
                        {isActive && <Check Fill="#F75C3C" />}
                    </InstrumentWrap>
                )
            })}
        </Container>
    )
}

const Container = styled.div`
    display: flex;
    flex-direction: column;
    gap: 2px;
    padding: 4px;
    background-color: #fff;
    border-radius: 8px;
    border: 1px solid rgba(0, 0, 0, 0.20);
    position: absolute;
    bottom: 76px;
    left: -50%;
`

const InstrumentWrap = styled.div<{ $isActive: boolean }>`
    display: flex;
    justify-content: space-between;
    align-items: center;
    width: 122px;
    ${({ theme }) => theme.font.body6};
    background-color: ${({ $isActive }) => $isActive ? "rgba(247, 92, 60, 0.20)" : "#fff"};
    padding: 6px 4px;
    cursor: pointer;
    color: ${({ theme, $isActive }) => $isActive ? theme.color.orange400 : theme.color.gray500};
    border-radius: 4px;
    &:hover {
        background-color: ${({ theme }) => theme.color.gray100};
    }
`

const InstrumentLeft = styled.div`
    display: flex;
    gap: 8px;
`
