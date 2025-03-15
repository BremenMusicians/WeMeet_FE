import './styles/global.css'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles/Theme'
import GlobalStyle from './styles/GlobalStyle'

function App() {
  return (
    <>
      <ThemeProvider theme={theme}>
        <GlobalStyle />
      </ThemeProvider>
    </>
  )
}

export default App
