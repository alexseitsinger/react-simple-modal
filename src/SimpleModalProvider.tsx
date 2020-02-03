import React, { ReactElement, ReactNode } from "react"
import { CSSObject } from "@emotion/core"

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
  renderedModal: ReactElement | null;
  style: CSSObject;
  renderedModalName: string;
}

export class SimpleModalProvider extends React.Component<Props, State> {
  state: State = {
    renderedModal: null,
    renderedModalName: null,
    style: { top: 0 },
  }

  element = React.createRef<HTMLDivElement>()

  removeModal = (modalName: string): void => {
    const { current } = this.element
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
      })

      // Force the window to re-scroll to the original position.
      // NOTE: Must be the last thing to run in order to reset scrolling.
      scrollWindow(topPos)
    }
  }

  renderModal = (modalName: string, el: ReactElement): void => {
    const { renderedModal } = this.state
    const { current } = this.element

    if (isDefined(renderedModal)) {
      return
    }

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
      renderedModal: el,
      renderedModalName: modalName,
    })
  }

  render(): ReactElement {
    const { renderModal, removeModal } = this
    const { renderedModal, style, } = this.state
    const { children } = this.props
    const value: ContextProps = {
      removeModal,
      renderModal,
    }

    const child = React.Children.only(children)
    const MainElement = (props: any): ReactElement => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...props,
          ref: this.element,
          style,
        })
      }
      return <>{child}</>
    }

    return (
      <>
        <Context.Provider value={value}>
          <MainElement />
        </Context.Provider>
        {renderedModal}
      </>
    )
  }
}
