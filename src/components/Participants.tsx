import styled from "styled-components";

interface ParticipantsProp {
    name: string;
    value: number;
    onChange: (newValue: number) => void;
}

export const Participants = ({ name, value, onChange }: ParticipantsProp) => {
    const handleIncrease = () => onChange(Math.min(5, value + 1));
    const handleDecrease = () => onChange(Math.max(2, value - 1));

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const newValue = Number(e.target.value);
        if (!isNaN(newValue) && newValue >= 2 && newValue <= 5) {
            onChange(newValue);
        }
    };

    return (
        <Container>
            <Button onClick={handleDecrease}>-</Button>
            <StyledInput min={2} max={5} type="number" value={value} name={name} onChange={handleChange} />
            <Button onClick={handleIncrease}>+</Button>
        </Container>
    );
};


const Container = styled.div`
    width: fit-content;
    display: flex;
    align-items: center;
    gap: 10px;
    border: 1px solid ${({ theme }) => theme.color.gray100};
    border-radius: 6px;
`;

const Button = styled.button`
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${({ theme }) => theme.color.gray500};
    background: none;
    font-size: 24px;
    width: 40px;
    height: 40px;
    cursor: pointer;
`;

const StyledInput = styled.input`
    width: 220px;
    height: 40px;
    text-align: center;
    font-size: 18px;
    outline: none;
`;
