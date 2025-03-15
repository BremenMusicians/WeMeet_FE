import { createGlobalStyle } from 'styled-components';

const GlobalStyle = createGlobalStyle`
    @font-face {
        font-family: 'Pretendard';
        font-weight: 700;
        font-style: bold;
        src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Bold.woff')
            format('woff2');
        font-display: swap;
    }

    @font-face {
        font-family: 'Pretendard';
        font-weight: 500;
        font-style: medium;
        src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Medium.woff')
            format('woff2');
        font-display: swap;
    }

    @font-face {
        font-family: 'Pretendard';
        font-weight: 400;
        font-style: normal;
        src: url('https://cdn.jsdelivr.net/gh/Project-Noonnu/noonfonts_2107@1.1/Pretendard-Regular.woff')
            format('woff2');
        font-display: swap;
    }

    * {
        margin: 0;
        padding: 0;
        outline: 0;
        box-sizing: border-box;
        border: 0;
        outline: unset;
        list-style: none;
        font-family: 'Pretendard', sans-serif;
        font-style: normal;
    }
    label {
        cursor: pointer;
        background-color: transparent;
    }
    a {
        text-decoration: none;
        color: inherit;
    }
    body {
        font-family: 'Pretendard', sans-serif;
    }
`;

export default GlobalStyle;
