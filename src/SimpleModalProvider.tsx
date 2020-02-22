import React, { ReactElement, ReactNode } from "react"
import { CSSObject } from "@emotion/core"

import { SimpleModalPageContainer } from "./elements"
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
} from "./utils/general"

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

  getContainerStyle = (modalName: string): CSSObject => {
    const { current } = this.mainRef
    /**
     * If our modal is alredy rendered, and we're just rendering a new, updated
     * version, we need to re-use the style that's already there. Otherwise, the
     * style will get reset and use the wrong yoffset/top.
     */
    const { style: currentStyle, renderedModalName } = this.state
    if (renderedModalName === modalName) {
      return currentStyle
    }

    let newStyle = defaultFixedStyle
    if (isDefined(current)) {
      const yOffset = getYOffset()
      newStyle = { ...newStyle, top: `-${yOffset}px` }
    }
    return newStyle
  }

  renderModal = (modalName: string, element: ReactElement): void => {
    this.setState({
      style: this.getContainerStyle(modalName),
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
        <SimpleModalPageContainer ref={this.mainRef} css={style}>
          <Context.Provider value={value}>
            {children}
          </Context.Provider>
        </SimpleModalPageContainer>
        {renderedModal}
      </>
    )
  }
}
