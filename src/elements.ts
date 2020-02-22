import { css } from "@emotion/core"
import styled from "@emotion/styled"

import { getShadeColor } from "./utils/general"

export const SimpleModalPageContainer = styled.div`
  min-height: 100%;
`

export const SimpleModalContainer = styled.div`
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

export const SimpleModalBackground = styled.div`
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

export const SimpleModalForeground = styled.div`
  z-index: 4;
  display: flex;
  flex-direction: row;
  justify-content: center;
  align-items: center;
  height: 100%;
`

export const SimpleModalContent = styled.div`
  height: 100%;
  width: 100%;
  position: relative;
  z-index: 5;
`

export const SimpleModalButton = styled.button`
  top: 0;
  right: 0;
  z-index: 2;
`
