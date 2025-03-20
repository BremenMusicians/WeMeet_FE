import styled from "styled-components";
import { Copy, Instrument, Lock, LogOut, Mike, MikeOff, Volume } from "../assets";
import { useState, useCallback, useRef } from "react";
import { InstrumentList } from "../components/Instrument";
import { FeatureButton } from "../components/InstrumentButton";
import { RangeInput } from "../components/RangeCustom";
import { UserVideo } from "../components/UserVideo";

enum FeatureType {
    INSTRUMENT = "instrument",
    VOLUME = "volume",
}

export const ConcertRoom = () => {
    const [mikeOn, setMikeOn] = useState(true);
    const [activeFeature, setActiveFeature] = useState<FeatureType | null>(null);

    const toggleMike = useCallback(() => {
        setMikeOn((prev) => !prev);
        setActiveFeature(null);
    }, []);

    const toggleFeature = useCallback((feature: FeatureType) => {
        setActiveFeature((prev) => (prev === feature ? null : feature));
    }, []);

    const codeRef = useRef<HTMLParagraphElement>(null);

    const handleCopyClipBoard = async () => {
        if (!codeRef.current) return;

        await navigator.clipboard.writeText(codeRef.current.innerText);

    };

    return (
        <Container>
            <Content>
                <TopBar>
                    <TitleWrap>
                        <Title>걸어서 집으로 <img src={Lock} alt="비공개" /></Title>
                        <Description>키보드 구합니다 매우매우 급함 키보드 올 때까지 숨 참음</Description>
                    </TitleWrap>
                    <CodeWrap>
                        <CodeText>초대 코드</CodeText>
                        <Code>
                            <p ref={codeRef}>0123</p>
                            <CopyImg src={Copy} alt="코드 복사" onClick={handleCopyClipBoard} />
                        </Code>
                    </CodeWrap>
                </TopBar>
                <VideoWrap>
                    {[...Array(4)].map((_, idx) => (
                        <UserVideo key={idx} />
                    ))}
                </VideoWrap>
                <BottomBarWrap>
                    <FeatureButton onClick={toggleMike}>
                        <img src={mikeOn ? Mike : MikeOff} alt="마이크" />
                    </FeatureButton>
                    <Position>
                        <FeatureButton
                            onClick={() => toggleFeature(FeatureType.INSTRUMENT)}
                            isActive={activeFeature === FeatureType.INSTRUMENT}
                        >
                            <Instrument Fill={activeFeature === FeatureType.INSTRUMENT ? "#F75C3C" : "#3F3F46"} />
                        </FeatureButton>
                        {activeFeature === FeatureType.INSTRUMENT && <InstrumentList activeInstrument="피아노" />}
                    </Position>
                    <Position>
                        <FeatureButton
                            onClick={() => toggleFeature(FeatureType.VOLUME)}
                            isActive={activeFeature === FeatureType.VOLUME}
                        >
                            <Volume Fill={activeFeature === FeatureType.VOLUME ? "#F75C3C" : "#3F3F46"} />
                        </FeatureButton>
                        {activeFeature === FeatureType.VOLUME && <RangeInput />}
                    </Position>
                    <ButtonWrapper>
                        <LogOut Fill="white" />
                    </ButtonWrapper>
                </BottomBarWrap>
            </Content>
        </Container>
    );
};

const Container = styled.div`
    margin: 0 auto;
    width: 1280px;
`;

const Content = styled.div`
    padding: 100px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
    height: 100dvh;
`;

const TopBar = styled.div`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding: 24px 0px;
`;

const TitleWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
`;

const Title = styled.h1`
    ${({ theme }) => theme.font.title1};
    color: #000;
`;

const Description = styled.p`
    ${({ theme }) => theme.font.body6};
    color: ${({ theme }) => theme.color.gray500};
`;

const CodeWrap = styled.div`
    display: flex;
    align-items: center;
    gap: 12px;
`;

const CodeText = styled.p`
    ${({ theme }) => theme.font.body4};
    color: ${({ theme }) => theme.color.gray700};
`;

const Code = styled.div`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 12px;
    gap: 10px;
    background-color: ${({ theme }) => theme.color.gray50};
    border: 1px solid ${({ theme }) => theme.color.gray200};
    border-radius: 6px;
`;

const CopyImg = styled.img`
    width: 20px;
    height: 20px;
    cursor: pointer;
`;

const VideoWrap = styled.div`
    display: grid;
    grid-template-columns: repeat(2, minmax(0, 1fr));
    gap: 10px;
    @media (max-width: 1440px) {
        width: 70%;
    }
    width: 100%;
    height: 100%;
    margin: auto;
    padding: 0px 44px;
`;

const BottomBarWrap = styled.div`
    display: flex;
    gap: 16px;
    margin: 0 auto;
`;

const Position = styled.div`
    position: relative;
`;

const ButtonWrapper = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: ${({ theme }) => theme.color.orange500};
    color: ${({ theme }) => theme.color.gray100};
    cursor: pointer;
`;

