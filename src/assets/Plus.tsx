import { IconProps } from '.'

export const Plus = ({ width = 24, height = 24, onClick, Fill }: IconProps) => {
  return (
    <svg width={width} height={height} viewBox="0 0 28 28" onClick={onClick} fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M7 14H14M14 14H21M14 14V21M14 14V7" stroke={Fill} strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  )
}
