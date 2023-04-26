import { createGlobalStyle } from "styled-components";

const GlobalStyles = createGlobalStyle`
  *, *::before, *::after {
  box-sizing: border-box;
  }

  * {
  margin: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
  }

  body {
    display: block;
    line-height: 1.5;
    --webkit-font-smoothing: antialiased;
  }

  img, svg, video, canvas, audio, iframe, embed, object {
    display: block;
    max0width: 100%;
  }

  input, button, textarea, select {
    font: inherit;
  }

  p, h1, h2, h3, h4, h5, h6 {
    overflow-wrap: break-word;
  }

  #root {
    isolation: isolate;
    height: 100%;
    width: 100%;
  }
`;

export default GlobalStyles;
