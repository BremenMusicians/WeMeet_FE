import React, { useEffect } from "react";
import styled from "styled-components";
import { Button } from "./Button";
import { Close } from "../assets";

interface ModalProps {
    onClose: () => void;
    onClick: () => void;
    children: React.ReactNode;
}

export const Modal = ({ onClose, children, onClick }: ModalProps) => {

    useEffect(() => {
        document.body.style.overflow = "hidden";
        return () => {
            document.body.style.overflow = "auto";
        };
    }, []);

    return (
        <ModalContainer>
            <ModalContent>
                <CloseButton onClick={onClose}>
                    <img width={24} height={24} src={Close} alt="닫기" />
                </CloseButton>
                {children}{/**사용 시 margin-bottom으로 버튼이랑 간격 띄우기 */}
                <ModalButtonWrap>
                    <Refusal onClick={onClose}>취소</Refusal>
                    <Button bigSize onClick={onClick}>확인</Button>
                </ModalButtonWrap>
            </ModalContent>
        </ModalContainer>
    );
};

const ModalContainer = styled.div`
    background: rgba(0, 0, 0, 0.20);
    position: fixed;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    z-index: 12;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const ModalContent = styled.div`
    background: white;
    padding: 36px 24px 24px 24px;
    border-radius: 8px;
    box-shadow: 0px 4px 6px rgba(0, 0, 0, 0.1);
    position: relative;
`;

const CloseButton = styled.button`
    position: absolute;
    top: 8px;
    right: 8px;
    width: 24px;
    height: 24px;
    background: none;
    cursor: pointer;
`

const ModalButtonWrap = styled.div`
    display: flex;
    gap: 8px;
`

const Refusal = styled.button`
    width: 100%;
    border-radius: 6px;
    color: ${({ theme }) => theme.color.gray600};
    border: 1px solid ${({ theme }) => theme.color.gray200};
    background-color: #fff;
    padding: 15px;
    cursor: pointer;
`