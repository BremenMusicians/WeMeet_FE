import styled from "styled-components";
import { useEffect } from "react";
import * as Tone from 'tone'

const SyntNotes: string[] = [
    "C2", "C#2", "D2", "D#2", "E2", "F2", "F#2", "G2", "G#2", "A2", "A#2", "B2",
    "C3", "C#3", "D3", "D#3", "E3", "F3", "F#3", "G3", "G#3", "A3", "A#3", "B3",
    "C4", "C#4", "D4", "D#4", "E4", "F4", "F#4", "G4", "G#4", "A4", "A#4", "B4",
    "C5", "C#5", "D5", "D#5", "E5", "F5", "F#5", "G5", "G#5", "A5", "A#5", "B5",
    "C6", "C#6", "D6", "D#6", "E6", "F6", "F#6", "G6", "G#6", "A6", "A#6", "B6",
];

export const Synthesizer = () => {
    const synth = new Tone.Synth().toDestination();

    const noteMap: { [key: string]: string } = {
        "KeyA": "C4",
        "KeyS": "D4",
        "KeyD": "E4",
        "KeyF": "F4",
        "KeyG": "G4",
        "KeyH": "A4",
        "KeyJ": "B4",
        "KeyK": "C5",
        "KeyW": "C#4",
        "KeyE": "D#4",
        "KeyT": "F#4",
        "KeyY": "G#4",
        "KeyU": "A#4",
    };

    const onKeyDown = (event: KeyboardEvent) => {
        const note = noteMap[event.code];

        if (note) {
            synth.triggerAttackRelease(note, "8n");
        }
    };

    useEffect(() => {
        window.addEventListener("keydown", onKeyDown);
        return () => {
            window.removeEventListener("keydown", onKeyDown);
        };
    }, []);

    const onClick = (note: string) => {
        synth.triggerAttackRelease(note, "8n");
    };

    return (
        <Container>
            <Content>
            {
                SyntNotes.map((note) => {
                    return note.includes("#") ? (
                        <BlackKeyBoard key={note} onClick={() => onClick(note)} />
                    ) : (
                        <WhiteKeyBoard key={note} onClick={() => onClick(note)} />
                    );
                })
         }
            </Content>
        </Container>
    );
};

const BlackKeyBoard = styled.button`
    background-color: #000;
    width: 22px;
    height: 102px;
    border: 1px solid ${({ theme }) => theme.color.gray400};
    border-radius: 0px 0px 4px 4px;
    box-shadow: 0px 5px 2px 0px rgba(0, 0, 0, 0.25);
    position: absolute;
    margin-left: -12px;
    &:active {
        margin-top: 4px;
    }
`;

const WhiteKeyBoard = styled.button`
    background-color: #fff;
    width: 34px;
    height: 180px;
    border: 1px solid ${({ theme }) => theme.color.gray400};
    border-radius: 0px 0px 4px 4px;
    box-shadow: 0px 5px 2px 0px rgba(0, 0, 0, 0.25);
    &:active {
        background-color: ${({ theme }) => theme.color.gray200};
    }
    &:disabled {
        background-color: #ddd;
    }
`;

const Content = styled.div`
    width: fit-content;
    border: 1px solid ${({theme}) => theme.color.gray200};
    border-radius: 16px;
    margin: auto;
`

const Container = styled.div`
    display: flex;
    align-items: center;
    width: 100%;
    height: 70dvh;
    background-color: ${({theme}) => theme.color.gray50};
`;
