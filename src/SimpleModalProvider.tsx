import React, { Component, ReactElement, ReactNode } from "react"
import { createPortal } from "react-dom"
import { CSSObject } from "@emotion/core"

import { SimpleModalPageContainer,SimpleModalPortalContainer } from "./elements"
import { Context, ContextProps } from "./SimpleModalContext"
import {
  defaultFixedStyle,
  getTopOffset,
  getYOffset,
  isDefined,
  isDOM,
  scrollWindow,
} from "./utils/general"

interface Props {
  children: ReactNode | ReactNode[];
}

interface State {
  modalName: string;
  style: CSSObject;
}

export class SimpleModalProvider extends Component<Props, State> {
  state: State = {
    modalName: "",
    style: { top: 0 },
  }

  mainRef = React.createRef<HTMLDivElement>()

  portalRef = React.createRef<HTMLDivElement>()

  handleUnmount = (currentModalName: string): void => {
    const { modalName } = this.state
    const { current } = this.mainRef
    if (isDefined(modalName) && currentModalName === modalName) {
      const topPos = isDefined(current) ? getTopOffset(current) : 0

      this.setState({
        modalName: "",
        style: { top: 0 },
      })

      scrollWindow(topPos)
    }
  }

  handleMount = (modalName: string): void => {
    this.setState({
      modalName,
      style: this.getContainerStyle(modalName),
    })
  }

  handleRender = (el: ReactElement): ReactElement => {
    const { current } = this.portalRef
    if (isDefined(current) && isDOM) {
      return createPortal(el, current)
    }
    // If we're on the server, just the DOM element so its visible in the
    // ssr source.
    return el
  }

  getContainerStyle = (modalName: string): CSSObject => {
    const { current } = this.mainRef
    const { style: currentStyle, modalName: currentModalName } = this.state
    if (currentModalName === modalName) {
      return currentStyle
    }

    let newStyle = defaultFixedStyle
    if (isDefined(current)) {
      const yOffset = getYOffset()
      newStyle = { ...newStyle, top: `-${yOffset}px` }
    }
    return newStyle
  }

  render(): ReactElement {
    const { style } = this.state
    const { children } = this.props
    const value: ContextProps = {
      handleRender: this.handleRender,
      handleUnmount: this.handleUnmount,
      handleMount: this.handleMount,
    }

    return (
      <SimpleModalPortalContainer ref={this.portalRef}>
        <SimpleModalPageContainer ref={this.mainRef} css={style}>
          <Context.Provider value={value}>{children}</Context.Provider>
        </SimpleModalPageContainer>
      </SimpleModalPortalContainer>
    )
  }
}
