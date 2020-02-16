import React, { ReactElement, ReactNode } from "react"
import { CSSObject } from "@emotion/core"

import { MainElement } from "src/elements"

//import { isFunction } from "underscore"
//import { uniqueId } from "underscore"
import { Context, ContextProps } from "./SimpleModalContext"
import {
  defaultFixedStyle,
  getTopOffset,
  getYOffset,
  isDefined,
  //isNullish,
  scrollWindow,
} from "./utils"

interface Props {
  children: ReactNode | ReactNode[];
}

interface State {
  renderedModal: ReactElement;
  style: CSSObject;
  renderedModalName: string;
  shouldRender: boolean;
}

export class SimpleModalProvider extends React.Component<Props, State> {
  state: State = {
    renderedModal: null,
    renderedModalName: null,
    style: { top: 0 },
    shouldRender: true,
  }

  mainRef = React.createRef<HTMLDivElement>()

  portalRef = React.createRef<HTMLDivElement>()

  removeModal = (modalName: string): void => {
    const { current } = this.mainRef
    const { renderedModalName } = this.state

    const isName = (
      isDefined(renderedModalName)
      && renderedModalName === modalName
    )
    if (isName) {
      // Record the current top position of the main element.
      //
      // NOTE:
      // Must be before everything else to capture the top position offset.)
      const topPos = isDefined(current) ? getTopOffset(current) : 0

      this.setState({
        style: { top: 0 },
        renderedModal: null,
        renderedModalName: null,
        shouldRender: true,
      })

      // Force the window to re-scroll to the original position.
      // NOTE: Must be the last thing to run in order to reset scrolling.
      scrollWindow(topPos)
    }
  }

  renderModal = (modalName: string, element: ReactElement): void => {
    //const { renderedModal } = this.state
    const { current } = this.mainRef

    let style = defaultFixedStyle

    if (isDefined(current)) {
      // If the top position is not greater than 0, apply a negative top offset
      // to move it up when the modal is opened.
      const yOffset = getYOffset()
      const topPos = getTopOffset(current)
      if (!(topPos > 0)) {
        style = { ...style, top: `-${yOffset}px` }
      }
    }

    this.setState({
      style,
      renderedModalName: modalName,
      renderedModal: element,
      shouldRender: false,
    })
  }

  render(): ReactElement {
    const { renderModal, removeModal } = this
    const { renderedModal, style, shouldRender } = this.state
    const { children } = this.props
    const value: ContextProps = {
      removeModal,
      renderModal,
      shouldRender,
    }

    return (
      <>
        <MainElement ref={this.mainRef} css={style}>
          <Context.Provider value={value}>
            {children}
          </Context.Provider>
        </MainElement>
        {renderedModal}
      </>
    )
  }
}
