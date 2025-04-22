import './styles/Global.css'
import { ThemeProvider } from 'styled-components'
import { theme } from './styles/Theme'
import GlobalStyle from './styles/GlobalStyle'
import { Router } from './Router'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      refetchOnWindowFocus: false,
      staleTime: 5000,
      retry: 1,
    },
  },
})

function App() {
  return (
    <ThemeProvider theme={theme}>
      <QueryClientProvider client={queryClient}>
        <GlobalStyle />
        <Router />
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
