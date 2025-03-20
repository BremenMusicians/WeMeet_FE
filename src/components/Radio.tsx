import styled from "styled-components";

interface CustomRadioProps {
    name: string;
    id: string;
    label: string;
    value: string;
    checked: boolean;
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
}


export const CustomRadioComponents = ({ name, id, label, value, checked, onChange }: CustomRadioProps) => (
    <CustomRadio>
        <input
            type="radio"
            name={name}
            id={id}
            value={value}
            checked={checked}
            onChange={onChange}
        />
        <label htmlFor={id}>{label}</label>
    </CustomRadio>
);

const CustomRadio = styled.div`
    display: flex;
    align-items: center;
    cursor: pointer;
    margin-right: 20px;

    input[type="radio"] {
        display: none;
    }

    label {
        position: relative;
        padding-left: 30px; 
        cursor: pointer;

        &::before {
            content: '';
            position: absolute;
            left: 0;
            top: 50%;
            transform: translateY(-50%);
            width: 20px; 
            height: 20px; 
            border: 2px solid ${({ theme }) => theme.color.gray200};
            border-radius: 50%;
            background-color: white;  
            transition: background-color 0.3s ease, border 0.3s ease;  
        }
    }

    input[type="radio"]:checked + label::before {
        background-color: ${({ theme }) => theme.color.orange400};  
        border: 2px solid ${({ theme }) => theme.color.orange400};  
    }

    input[type="radio"]:checked + label::after {
        content: '';
        position: absolute;
        left: 7px;
        top: 50%;
        transform: translateY(-50%);
        width: 10px;
        height: 10px;
        border-radius: 50%;
        background-color: white; 
    }
`;