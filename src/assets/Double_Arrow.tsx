import { IconProps } from '.'

export const Double_Arrow = ({ width = 24, height = 24, Fill, direction = 'left' }: IconProps) => {
  const rotate = {
    left: 0,
    right: 180,
    up: 270,
    down: 90,
  }
  return (
    <svg style={{ rotate: `${rotate[direction]}deg` }} xmlns="http://www.w3.org/2000/svg" width={width} height={height} fill="none" viewBox="0 0 24 24">
      <path stroke={Fill} strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m13 8 4 4-4 4M7 8l4 4-4 4" />
    </svg>
  )
}
