import React, { ReactElement, ReactNode } from "react"
import { CSSObject } from "@emotion/core"

import { SimpleModal } from "./SimpleModal"
import { Context, ContextProps } from "./SimpleModalContext"

const defaultProps = {
  containerClassName: "SimpleModal",
  backgroundShade: "dark",
  isCloseButtonVisible: true,
  closeButtonPosition: "foreground",
  closeButtonBody: "close",
  layerPosition: "above",
  defaultIndex: 200,
  isVisible: true,
}

type DefaultProps = Readonly<typeof defaultProps>

export type SimpleModalWithContextProps = {
  modalName: string,
  onClose: () => void,
  closeButtonStyle?: CSSObject,
  onClickCloseButton?: () => void,
  onOpen?: () => void,
  onEscapeKey?: () => void,
  onClickBackground?: () => void,
  isVisible: boolean,
  containerClassName?: string,
  backgroundShade?: string,
  isCloseButtonVisible?: boolean,
  closeButtonPosition?: string,
  closeButtonBody?: ReactNode,
  layerPosition?: string,
  defaultIndex?: number,
  children: ReactNode | ReactNode[],
} & Partial<DefaultProps>

export function SimpleModalWithContext(
  props: SimpleModalWithContextProps
): ReactElement {
  return (
    <Context.Consumer>
      {({ renderModal, removeModal }: ContextProps): ReactElement => (
        <SimpleModal
          {...props}
          renderModal={renderModal}
          removeModal={removeModal}
        />
      )}
    </Context.Consumer>
  )
}

SimpleModalWithContext.defaultProps = defaultProps
