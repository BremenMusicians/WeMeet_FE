import React from "react";
import styled from "styled-components";
import { Drum, Guitar, Piano, Slider } from "../assets";
import { useLocation, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";

interface Instrument {
    icon: React.ReactNode;
    name: string;
}

export const InstrumentBadge = () => {
    const location = useLocation();
    const router = useNavigate();
    
    const searchParams = new URLSearchParams(location.search);
    const currentInstrument = searchParams.get("name");

    

    const data: Instrument[] = [
        {icon: <Piano Fill={currentInstrument === "피아노" ? "#F75C3C" : "#A1A1AA"} />, name: '피아노'},
        {icon: <Drum Fill={currentInstrument === "드럼" ? "#F75C3C" : "#A1A1AA"} />, name: "드럼"},
        {icon: <Slider Fill={currentInstrument === "신스" ? "#F75C3C" : "#A1A1AA"} />, name: '신스'},
        {icon: <Guitar Fill={currentInstrument === "기타" ? "#F75C3C" : "#A1A1AA"} />, name: '기타'}
    ];

    return (
        <Container>
            {data.map((item) => {
                const isActive = currentInstrument === item.name; 

                return (
                    <Content 
                        key={item.name} 
                        as={motion.div}
                        initial={{ opacity: 0.5, scale: 1 }}
                        animate={{ opacity: isActive ? 1 : 0.7, scale: isActive ? 1.1 : 1 }}
                        transition={{ duration: 0.2 }}
                        whileHover={{ scale: 1.1 }} 
                        whileTap={{ scale: 0.95 }} 
                        $isActive={isActive} 
                        onClick={() => router(`/instrument?name=${item.name}`)} 
                        role="button"
                        tabIndex={0}
                        aria-label={`${item.name} 악기 선택`}
                        aria-pressed={isActive}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') {
                            router(`/instrument?name=${item.name}`);
                            }
                        }}
                    >
                        <motion.div 
                            initial={{ opacity: 0, y: 5 }} 
                            animate={{ opacity: 1, y: 0 }} 
                            transition={{ duration: 0.3 }}
                        >
                            {item.icon}
                        </motion.div>
                        {isActive && (
                            <motion.p 
                                initial={{ opacity: 0, y: 5 }} 
                                animate={{ opacity: 1, y: 0 }} 
                                transition={{ duration: 0.3 }}
                            >
                                {item.name}
                            </motion.p>
                        )}
                    </Content>
                );
            })}
        </Container>
    );
};

const Container = styled.div`
    display: flex;
    background-color: ${({theme}) => theme.color.gray50};
    border: 1px solid ${({theme}) => theme.color.gray200};
    gap: 8px;
    padding: 4px;
    border-radius: 8px;
    width: fit-content;
`;

const Content = styled.div<{$isActive?: boolean}>`
    display: flex;
    align-items: center;
    gap: 8px;
    padding: 8px;
    border-radius: 4px;
    cursor: pointer;
    ${({theme}) => theme.font.body6}
    background: ${({$isActive}) => $isActive ? "rgba(247, 92, 60, 0.20)" : "transparent"};
    color: ${({theme, $isActive}) => $isActive ? theme.color.orange400 : "transparent"};
`;
