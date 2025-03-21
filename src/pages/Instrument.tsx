import styled from "styled-components";
import { PianoComponents } from "../components/Piano";
import { InstrumentBadge } from "../components/InstrumentBadge";
import { useLocation } from "react-router-dom";

export const Instrument = () => {
    const location = useLocation();
    const searchParams = new URLSearchParams(location.search);
    const currentInstrument = searchParams.get("name");


    return (
      <Container>
        <Content>
           <InstrumentBadge/>
           {currentInstrument === "피아노" && ( <PianoComponents/> )}
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
    gap: 10px;
    width: 100%;
`;
