import styled from "styled-components";

interface FeatureButtonProp {
    children: React.ReactNode;
    isActive?: boolean;
    onClick?: () => void;
}

export const FeatureButton = ({ children, isActive, onClick }: FeatureButtonProp) => {
    return (
        <ButtonWrapper $isActive={isActive} onClick={onClick}>
            {children}
        </ButtonWrapper>
    );
};

const ButtonWrapper = styled.button<{ $isActive?: boolean }>`
    display: flex;
    justify-content: center;
    align-items: center;
    width: 64px;
    height: 64px;
    border-radius: 50%;
    background-color: ${({ theme, $isActive }) => $isActive ? theme.color.orange50 : theme.color.gray100};
    color: ${({ theme, $isActive }) => $isActive ? theme.color.orange50 : theme.color.gray100};
    cursor: pointer;
    position: relative;
`;