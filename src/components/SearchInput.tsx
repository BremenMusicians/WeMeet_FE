import React from 'react';
import styled from 'styled-components';
import { Search } from '../assets';

interface InputProp {
    placeholder?: string;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
    name?: string;
    value: string;
}

export const SearchInput = ({
    placeholder,
    name = '',
    onChange,
    value,
}: InputProp) => {

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        onChange(e) // 추후 api 명세보고 수정 할 예정
    };


    return (
        <InputContainer>
            <img src={Search} alt="Icon" width={24} />
            <SearchInputContainer
                autoComplete="off"
                placeholder={placeholder}
                name={name}
                value={value}
                onChange={handleChange}
            />
        </InputContainer>
    );
};

const InputContainer = styled.div`
    display: flex;
    align-items: center;
    padding: 16px 20px;
    border-radius: 100px;
    border: 1px solid ${({ theme }) => theme.color.gray200};
    background-color: ${({ theme }) => theme.color.gray50};
    gap: 20px;
`;

const SearchInputContainer = styled.input`
    width: 100%;
    height: 100%;
    background-color: ${({ theme }) => theme.color.gray50};
    &::placeholder{
        color: ${({ theme }) => theme.color.gray300};
        ${({ theme }) => theme.font.body4}
    }
`;
