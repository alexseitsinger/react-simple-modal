import React, { ReactElement, ReactNode } from "react"
import { CSSObject } from "@emotion/core"

import { SimpleModal } from "./SimpleModal"
import { Context, ContextProps } from "./SimpleModalContext"

const defaultProps = {
  containerClassName: "SimpleModal",
  containerLayer: 200,
  backgroundShade: "dark",
  closeButtonClassName: "SimpleModal-CloseButton",
  closeButtonPosition: "foreground",
  isCloseButtonVisible: false,
}

type DefaultProps = Readonly<typeof defaultProps>

type BackgroundShades =
  | "dark"
  | "darker"
  | "darkest"
  | "light"
  | "lighter"
  | "lightest"

type CloseButtonPositions = "foreground" | "window"

export type SimpleModalWithContextProps = {
  // Required
  modalName: string,

  // Container
  containerClassName?: string,
  containerLayer?: number,

  // Background
  backgroundShade?: BackgroundShades,
  onClickBackground?: () => void,

  // Close Button
  isCloseButtonVisible?: boolean,
  closeButtonClassName?: string,
  closeButtonStyle?: CSSObject,
  closeButtonPosition?: CloseButtonPositions,
  onClickCloseButton?: () => void,
  renderCloseButton?: () => ReactElement,

  // Escape Key Callback
  onEscapeKey?: () => void,

  // Modal Content
  children?: ReactNode | ReactNode[],
} & Partial<DefaultProps>

type Props = SimpleModalWithContextProps

export const SimpleModalWithContext = (props: Props): ReactElement => (
  <Context.Consumer>
    {({
      handleRender,
      handleMount,
      handleUnmount,
    }: ContextProps): ReactElement => {
      return (
        <SimpleModal
          {...props}
          handleRender={handleRender}
          handleMount={handleMount}
          handleUnmount={handleUnmount}
        />
      )
    }}
  </Context.Consumer>
)

SimpleModalWithContext.defaultProps = defaultProps
