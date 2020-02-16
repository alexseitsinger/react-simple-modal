import { css } from "@emotion/core"
import styled from "@emotion/styled"

import { getShadeColor } from "src/utils"

export const MainElement = styled.div`
  min-height: 100%;
  height: 100%;
`

export const Container = styled.div`
  position: absolute;
  min-height: 100%;
  width: 100%;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  ${({ containerLayer }: { containerLayer: number }): any => {
    return css`
      z-index: ${containerLayer};
    `
  }}
`

export const Background = styled.div`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  min-height: 100%;
  z-index: 3;
  ${({ backgroundShade }: { backgroundShade: string }): any => {
    return css`
      background-color: ${getShadeColor(backgroundShade)};
    `
  }}
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
  top: 0;
  right: 0;
  z-index: 2;
`
