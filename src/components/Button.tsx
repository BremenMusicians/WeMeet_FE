import React from "react"
import styled from "styled-components"

interface ButtonProps {
    children: React.ReactNode;
    onClick: () => void;
    bigSize?: boolean;
    disabled?: boolean;
    width?: number
}

export const Button = ({ children, onClick, bigSize = false, disabled = false, width }: ButtonProps) => {
    return (
        <ButtonContainer
            onClick={onClick}
            $disabled={disabled}
            $bigSize={bigSize}
            $width={width}
            aria-disabled={disabled}
        >
            {children}
        </ButtonContainer>
    )
}

const ButtonContainer = styled.button<{ $disabled: boolean; $bigSize: boolean, $width?: number }>`
    display: flex;
    justify-content: center;
    align-items: center;
    border: 1px solid ${({ theme, $disabled }) => $disabled ? theme.color.orange100 : theme.color.orange500};
    background-color: ${({ theme, $disabled }) => $disabled ? theme.color.orange50 : theme.color.orange500};
    color: ${({ $disabled, theme }) => $disabled ? theme.color.orange400 : "#fff"};
    border-radius: 6px;
    height: ${({ $bigSize }) => $bigSize ? "48px" : "40px"};
    padding: ${({ $bigSize }) => ($bigSize ? "16px" : "0px 16px")};
    cursor: pointer;
    width: ${({ $width }) => $width ? `${$width}px` : '100%'};
    &:hover {
        background-color: ${({ theme, $disabled }) => !$disabled && theme.color.orange400};
    }
    ${({ theme }) => theme.font.body5}
`
