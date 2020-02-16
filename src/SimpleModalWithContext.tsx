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

export function SimpleModalWithContext(
  props: SimpleModalWithContextProps
): ReactElement {
  return (
    <Context.Consumer>
      {({
        renderModal,
        removeModal,
        shouldRender,
      }: ContextProps): ReactElement => (
        <SimpleModal
          {...props}
          shouldRender={shouldRender}
          renderModal={renderModal}
          removeModal={removeModal}
        />
      )}
    </Context.Consumer>
  )
}

SimpleModalWithContext.defaultProps = defaultProps
