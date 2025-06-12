import styled from 'styled-components'
import { First } from './First'
import { Second } from './Second'
import { Third } from './Third'

function Landing() {
  return (
    <Wrapper>
      <First />
      <Second />
      <Third />
    </Wrapper>
  )
}

const Wrapper = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
`

export default Landing
