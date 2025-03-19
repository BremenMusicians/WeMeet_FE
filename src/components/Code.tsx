import { useState, useRef } from "react";
import styled from "styled-components";

interface CodeInputProps {
    onComplete: (code: string) => void;
}

export const CodeInput = ({ onComplete }: CodeInputProps) => {
    const length = 4;
    const [values, setValues] = useState<string[]>(Array(length).fill(""));
    const inputRefs = useRef<HTMLInputElement[]>([]);

    const handleChange = (index: number, value: string) => {
        const trimmedValue = value.slice(0, 1);
        if (!/^\d?$/.test(trimmedValue)) return;

        const newValues = [...values];
        newValues[index] = trimmedValue;
        setValues(newValues);

        const code = newValues.join("");
        if (code.length === length && !newValues.includes("")) {
            onComplete(code);
        }

        if (trimmedValue && index < length - 1) {
            inputRefs.current[index + 1]?.focus();
        }
    };

    const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
        if (e.key === "Backspace" && !values[index] && index > 0) {
            inputRefs.current[index - 1]?.focus();
        }
    };

    return (
        <Container>
            {values.map((value, index) => (
                <InputBox
                    key={index}
                    ref={(el) => {
                        if (el) inputRefs.current[index] = el;
                    }}
                    type="text"
                    value={value}
                    maxLength={1}
                    onChange={(e) => handleChange(index, e.target.value)}
                    onKeyDown={(e) => handleKeyDown(index, e)}
                />
            ))}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    gap: 8px;
`;

const InputBox = styled.input`
    width: 80px;
    height: 76px;
    font-size: 40px;
    text-align: center;
    border: 2px solid #ddd;
    border-radius: 8px;
    outline: none;

    &:focus {
        border-color: ${({ theme }) => theme.color.orange200};
        caret-color: ${({ theme }) => theme.color.orange400};
        background-color: ${({ theme }) => theme.color.orange50};
    }
`;
