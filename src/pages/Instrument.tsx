import styled from "styled-components";
import { PianoComponents } from "../components/Piano";
import { InstrumentBadge } from "../components/InstrumentBadge";
import { useLocation } from "react-router-dom";
import { Synthesizer } from "../components/synthesizer";

export const Instrument = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const currentInstrument = searchParams.get("name");


    return (
      <Container>
        <Content>
           <InstrumentBadge/>
           {currentInstrument === "피아노" && ( <PianoComponents/> )}
           {currentInstrument === "신스" && (<Synthesizer/>)}
        </Content>
      </Container>
    )
}

const Container = styled.div`
    margin: 0 auto;
    max-width: 1280px;
`;

const Content = styled.div`
    padding: 100px 24px 24px 24px;
    display: flex;
    flex-direction: column;
    gap: 24px;
    width: 100%;
`;
