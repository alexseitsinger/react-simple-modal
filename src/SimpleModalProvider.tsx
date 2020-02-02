import React, { ReactElement, ReactNode } from "react"
import { CSSObject } from "@emotion/core"

import { Context } from "./SimpleModalContext"
import { defaultFixedStyle, getTopOffset,getYOffset,isDefined, scrollWindow } from "./utils"

interface Props {
  children: ReactNode | ReactNode[];
}

interface State {
  style: CSSObject;
  isFixed: boolean;
}

export class SimpleModalProvider extends React.Component<Props, State> {
  state = {
    style: {},
    isFixed: false,
  }

  mainRef = React.createRef<HTMLElement>()

  shouldComponentUpdate(nextProps: Props, nextState: State): boolean {
    const propsChanged = nextProps !== this.props
    const { isFixed } = this.state
    const stateChanged = nextState.isFixed !== isFixed
    const shouldUpdate = (propsChanged && stateChanged)
    if (shouldUpdate) {
      return true
    }
    return false
  }

  setFree = (): void => {
    const { isFixed } = this.state
    if (isFixed === false) {
      return
    }

    const style = {
      top: 0,
    }
    const nextState = {
      style,
      isFixed: false,
    }

    let topPos: number
    const { current } = this.mainRef
    if (isDefined(current)) {
      // Record the current top position of the main element.
      // NOTE: Must be before everything else to capture the top position offset.)
      topPos = getTopOffset(current)
    }

    // Apply the style for top position reset.
    this.setState(nextState)

    if (isDefined(topPos)) {
      // Force the window to re-scroll to the original position.
      // NOTE: Must be the last thing to run in order to reset scrolling.
      scrollWindow(topPos)
    }
  }

  setFixed = (): void => {
    const { isFixed } = this.state
    if (isFixed) {
      return
    }

    let style = defaultFixedStyle
    const nextState = {
      style,
      isFixed: true,
    }

    const { current } = this.mainRef
    if (isDefined(current)) {
      // If the top position is not greater than 0, apply a negative top offset
      // to move it up when the modal is opened.
      const yOffset = getYOffset()
      const topPos = getTopOffset(current)
      if (!(topPos > 0)) {
        style = {
          ...style,
          top: `-${yOffset}px`,
        }
      }
    }

    this.setState(nextState)
  }

  render(): ReactElement {
    const { setFixed, setFree } = this
    const { style, isFixed } = this.state
    const { children, ...restProps } = this.props

    /**
     * Replace the child with a wrapped copy that uses the css from our local
     * state as its css style. This lets us fix/unfix the element via the
     * methods on this class (invoked from the context-connected SimpelModal
     * instances).
     */
    const child = React.Children.only(children)
    const MainElement = (): ReactElement => {
      if (React.isValidElement(child)) {
        return React.cloneElement(child, {
          ...restProps,
          style,
        })
      }
      return <>{child}</>
    }

    /**
     * Pass some functions down through context for each simple modal to be able
     * to toggle the fixed state of the main element.
     */
    const value = {
      setFixed,
      setFree,
      isFixed,
    }

    return (
      <Context.Provider value={value}>
        <MainElement />
      </Context.Provider>
    )
  }
}
