import React, { useState } from "react";
import styled from "styled-components";
import { EyeOff, EyeOpen } from "../assets";

interface InputProps {
    label?: string;
    type: "text" | "password";
    name: string;
    value: string;
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    onKeyDown?: (event: React.KeyboardEvent<HTMLInputElement>) => void;
}

export const Input = ({ label, type, name, value, placeholder, onChange, onKeyDown }: InputProps) => {
    const [showPassword, setShowPassword] = useState(false);

    const inputType = type === "password" && !showPassword ? "password" : "text";

    return (
        <InputWrap>
            {label && <InputLabel>{label}</InputLabel>}
            <InputContainer>
                <InputContent
                    name={name}
                    value={value}
                    onChange={onChange}
                    onKeyDown={onKeyDown}
                    type={inputType}
                    placeholder={placeholder}
                />
                {type === "password" && (
                    <ToggleButton onClick={() => setShowPassword((prev) => !prev)} type="button">
                        <img src={showPassword ? EyeOpen : EyeOff} alt={showPassword ? "Hide password" : "Show password"} />
                    </ToggleButton>
                )}
            </InputContainer>
        </InputWrap>
    );
};

const InputWrap = styled.div`
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
`;

const InputContainer = styled.div`
    display: flex;
    gap: 10px;
    background-color: ${({ theme }) => theme.color.gray100};
    border: 1px solid ${({ theme }) => theme.color.gray200};
    border-radius: 6px;
    padding: 10px 16px;
    height: 48px;
`;

const InputContent = styled.input`
    background-color: ${({ theme }) => theme.color.gray100};
    width: 100%;
    &::placeholder {
        color: ${({ theme }) => theme.color.gray300};
    }
`;

const InputLabel = styled.label`
    color: #000;
    ${({ theme }) => theme.font.body6}
`;

const ToggleButton = styled.button`
    background: none;
    border: none;
    cursor: pointer;
    display: flex;
    align-items: center;
    padding: 0;
`;
