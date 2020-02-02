import React, { ReactElement, ReactNode } from "react"
import { CSSObject } from "@emotion/core"

import { Context, ContextProps } from "./SimpleModalContext"
import { SimpleModalOuter } from "./SimpleModalOuter"

const defaultProps = {
  mountPointSelector: "document.body",
  //mainElementSelector: "main",
  containerClassName: "SimpleModal",
  backgroundShade: "dark",
  isCloseButtonVisible: true,
  closeButtonPosition: "foreground",
  closeButtonBody: "close",
  layerPosition: "above",
  defaultIndex: 200,
}

type DefaultProps = Readonly<typeof defaultProps>

export type SimpleModalWithContextProps = {
  onClose: () => void,
  closeButtonStyle?: CSSObject,
  onClickCloseButton?: () => void,
  onOpen?: () => void,
  onEscapeKey?: () => void,
  onClickBackground?: () => void,
  isVisible: boolean,
  mountPointSelector: string,
  //mainElement: ReactElement,
  //mainElementSelector: string,
  containerClassName: string,
  backgroundShade: string,
  isCloseButtonVisible: boolean,
  closeButtonPosition: string,
  closeButtonBody: ReactNode,
  layerPosition: string,
  defaultIndex: number,
  children: ReactNode | ReactNode[],
} & Partial<DefaultProps>

export function SimpleModalWithContext(
  props: SimpleModalWithContextProps
): ReactElement {
  return (
    <Context.Consumer>
      {({ isFixed, setFixed, setFree }: ContextProps): ReactElement => (
        <SimpleModalOuter
          {...props}
          isFixed={isFixed}
          setFixed={setFixed}
          setFree={setFree}
        />
      )}
    </Context.Consumer>
  )
}

SimpleModalWithContext.defaultProps = defaultProps
