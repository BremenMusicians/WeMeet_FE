import "./styles/global.css";
import { ThemeProvider } from "styled-components";
import { theme } from "./styles/Theme";
import GlobalStyle from "./styles/GlobalStyle";
import { Router } from "./router";

function App() {
  return (
    <ThemeProvider theme={theme}>
      <GlobalStyle />
      <Router />
    </ThemeProvider>
  );
}

export default App;
