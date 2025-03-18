import styled from 'styled-components';

interface TabProps {
    name: string
    isActive: boolean
    onClick: () => void
}

export const Tab = ({ name, isActive, onClick }: TabProps) => {
    return (
        <TabStyle
            onClick={onClick}
            $isActive={isActive}
        >
            {name}
        </TabStyle>
    );
};


const TabStyle = styled.div<{ $isActive: boolean }>`
    padding: 16px 20px;
    cursor: pointer;
    color: ${({ $isActive, theme }) => $isActive ? "#000" : theme.color.gray400};
    ${({ theme }) => theme.font.body2}
`