import styled from "@emotion/styled"
import { css } from "@emotion/core"

export const Container = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  ${props => props.zIndex && css`
    z-index: ${props.zIndex};
  `}
`

export const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  z-index: 3;
  ${(props) => props.backgroundShade === "dark" && css`
    background-color: rgba(22, 22, 22, 0.5);
  `}
  ${(props) => props.backgroundShade === "light" && css`
    background-color: rgba(255, 255, 255, 0.5);
  `}
`

export const Foreground = styled.div`
  z-index: 4;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export const Content = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 5;
`

export const Button = styled.button`
  ${(props) => props.position === "foreground" ? css`
    position: fixed;
  ` : css`
    position: absolute;
  `}
  top: 0;
  right: 0;
  z-index: 2;
  ${(props) =>
    props.position === "foreground" &&
    props.shade === "dark" &&
    css`
      color: #EEE;
    `
  }
  ${(props) =>
    props.position === "foreground" &&
    props.shade === "light" &&
    css`
      color: #222;
    `
  }
  ${(props) =>
    props.position === "window" &&
    props.shade === "dark" &&
    css`
      color: #222;
    `
  }
  ${(props) =>
    props.position === "window" &&
    props.shade === "light" &&
    css`
      color: #EEE;
    `
  }
`

