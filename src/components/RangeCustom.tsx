import React from 'react';
import styled from 'styled-components';


interface RangeInputProps {
  min?: number;
  max?: number;
  defaultValue?: number;
  onChange?: (value: number) => void;
}

export const RangeInput = ({
  min = 0,
  max = 100,
  defaultValue = 50,
  onChange
}: RangeInputProps) => {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    const progress = ((value - min) / (max - min)) * 100;
    e.target.style.setProperty('--range-progress', `${progress}%`);
    onChange?.(value);
  };

  return (
    <Container>
      <StyledRange
        type="range"
        min={min}
        max={max}
        defaultValue={defaultValue}
        onChange={handleChange}
        style={{ '--range-progress': `${((defaultValue - min) / (max - min)) * 100}%` } as React.CSSProperties}
      />
    </Container>
  );
};

const Container = styled.div`
    padding: 8px;
    position: absolute;
    top: -72px;
    left: -24px;
    transform: rotate(-90deg);
    border-radius: 8px;
    background: rgba(255, 255, 255, 0.40);
`

const StyledRange = styled.input`
  width: 93px;
  height: 6px;
  -webkit-appearance: none;
  background: transparent;
  outline: none;
  position: relative;
  bottom: 10px;


  &::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 12px;
    height: 12px;
    background: white;
    border: 1px solid ${({ theme }) => theme.color.gray100};
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    margin-top: -4px;
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    }
    
    &:active {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }
  
  &::-moz-range-thumb {
    width: 20px;
    height: 20px;
    background: white;
    border: none;
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    
    &:hover {
      transform: scale(1.05);
      box-shadow: 0 3px 6px rgba(0, 0, 0, 0.15);
    }
    
    &:active {
      transform: scale(1.1);
      box-shadow: 0 4px 8px rgba(0, 0, 0, 0.2);
    }
  }
  
  &::-webkit-slider-runnable-track {
    width: 100%;
    height: 4px;
    background: linear-gradient(
      to right,
      #F75C3C 0%,
      #F75C3C var(--range-progress),
      #e5e5e5 var(--range-progress),
      #e5e5e5 100%
    );
    border-radius: 2px;
    position: relative;
    top: 8px; 
  }
  
  &::-moz-range-track {
    width: 100%;
    height: 4px;
    background: #e5e5e5;
    border-radius: 2px;
  }
  
  &::-moz-range-progress {
    height: 4px;
    background-color: ${({ theme }) => theme.color.orange300};
    border-radius: 2px;
  }
`;