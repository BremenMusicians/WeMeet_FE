
import { useState, useRef, useEffect } from 'react';
import styled from 'styled-components';

interface ToggleProps {
    onChange: (menu: 'recommend' | 'request') => void;
}

export const Toggle = ({ onChange }: ToggleProps) => {
    const [currentMenu, setCurrentMenu] = useState<
        'recommend' | 'request'
    >('recommend');
    const [xpos, setXpos] = useState<number | undefined>(0);
    const applicationBtn = useRef<HTMLButtonElement | null>(null);
    const earlyReturnBtn = useRef<HTMLButtonElement | null>(null);

    useEffect(() => {
        if (currentMenu === 'recommend' && applicationBtn.current) {
            setXpos(applicationBtn.current.offsetLeft);
        } else if (currentMenu === 'request' && earlyReturnBtn.current) {
            setXpos(earlyReturnBtn.current.offsetLeft);
        }
        onChange(currentMenu);
    }, [currentMenu, onChange]);

    return (
        <MenuContainer>
            <UnderLine left={xpos} />
            <MenuWrapper>
                <StyledBtn
                    name="recommned"
                    ref={applicationBtn}
                    isActive={currentMenu === 'recommend'}
                    onClick={() => setCurrentMenu('recommend')}
                >
                    추천 친구
                </StyledBtn>
                <StyledBtn
                    name="request"
                    ref={earlyReturnBtn}
                    isActive={currentMenu === 'request'}
                    onClick={() => setCurrentMenu('request')}
                >
                    친구 요청
                </StyledBtn>
            </MenuWrapper>
        </MenuContainer>
    );
};

const MenuContainer = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  height: 45px;
  width: fit-content;
  border-radius: 12px;
  padding: 4px;
  background-color: ${({ theme }) => theme.color.gray100};
  border: 1px solid ${({ theme }) => theme.color.gray200};
`;

const MenuWrapper = styled.div`
  display: flex;
  height: 43px;
  gap: 8px;
`;

const StyledBtn = styled.button<{ isActive: boolean }>`
  background: none;
  border: none;
  padding: 10px 16px;
  cursor: pointer;
  ${({ theme }) => theme.font.body6}
  z-index: 1;
  width: 100px;
  color: ${({ isActive, theme }) => isActive ? '#fff' : theme.color.gray500};
`;

const UnderLine = styled.div<{ left?: number }>`
  width: 100px;
  height: 37px;
  border-radius: 32px;
  position: absolute;
  left: ${(props) => (props.left ?? 0) + 'px'};
  transition: left 0.5s ease;
  z-index: 0;
  background-color: ${({ theme }) => theme.color.orange400};
`;
