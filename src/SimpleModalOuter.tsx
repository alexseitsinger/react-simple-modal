import React, { ReactElement } from "react"
import ReactDOM from "react-dom"
//import stylePropType from "react-style-proptype"
//import PropTypes from "prop-types"
import { debounce } from "underscore"

import { ContextProps } from "src/SimpleModalContext"
import { SimpleModalInner } from "src/SimpleModalInner"
import { SimpleModalWithContextProps } from "src/SimpleModalWithContext"

import {
  addEvent,
  addStyle,
  //disableScrollingOnMainElement,
  //disableScrollingOnOtherInstances,
  //enableScrollingOnMainElement,
  //enableScrollingOnOtherInstances,
  getLayerIndex,
  getMountPoint,
  getTopOffset,
  getYOffset,
  isDefined,
  isDOM,
  isEscapeKey,
  removeEvent,
} from "./utils"

type Props = SimpleModalWithContextProps & ContextProps

export class SimpleModalOuter extends React.PureComponent<Props> {
  // When the document has a keydown event, debounce the event until the last
  // one. Then, check if it's the ESC key. If it is, check if we got a prop
  // called onEscapeKey, and invoke it if so.
  handleKeyDown = debounce((e: KeyboardEvent): void => {
    const { isVisible, onEscapeKey } = this.props

    if (isEscapeKey(e.which)) {
      if (isVisible) {
        if (onEscapeKey !== undefined) {
          onEscapeKey()
        }
      }
    }
  }, 250)

  componentDidMount(): void {
    this.enableScrolling()

    addEvent("keydown", this.handleKeyDown)
  }

  componentWillUnmount(): void {
    removeEvent("keydown", this.handleKeyDown)
  }

  handleDidMount = (el: HTMLDivElement): void => {
    const {
      onOpen,
      layerPosition,
      defaultIndex,
      containerClassName,
    } = this.props

    this.disableScrolling()

    if (isDefined(el)) {
      const zIndex = getLayerIndex(
        layerPosition,
        defaultIndex,
        containerClassName
      )
      addStyle(el, { zIndex })
    }

    if (onOpen !== undefined) {
      onOpen()
    }
  }

  handleWillUnmount = (): void => {
    //...
  }

  renderModal = (): ReactElement => {
    const {
      children,
      backgroundShade,
      onClickBackground,
      closeButtonPosition,
      layerPosition,
      defaultIndex,
      containerClassName,
      isCloseButtonVisible,
      closeButtonStyle,
      onClickCloseButton,
      closeButtonBody,
    } = this.props

    return (
      <SimpleModalInner
        onDidMount={this.handleDidMount}
        onWillUnmount={this.handleWillUnmount}
        backgroundShade={backgroundShade}
        onClickBackground={onClickBackground}
        closeButtonPosition={closeButtonPosition}
        layerPosition={layerPosition}
        defaultIndex={defaultIndex}
        containerClassName={containerClassName}
        isCloseButtonVisible={isCloseButtonVisible}
        closeButtonStyle={closeButtonStyle}
        onClickCloseButton={onClickCloseButton}
        closeButtonBody={closeButtonBody}>
        {children}
      </SimpleModalInner>
    )
  }

  disableScrolling = (): void => {
    const { isVisible, isFixed, setFixed } = this.props
    if (isFixed === false && isVisible === true) {
      setFixed()
    }
  }

  enableScrolling = (): void => {
    const { isVisible, setFree, isFixed } = this.props
    if (isFixed && isVisible === false) {
      setFree()
    }
  }

  render(): ReactElement | null {
    const { isVisible, mountPointSelector } = this.props

    if (isVisible) {
      /**
       * Regardless of the presences of the DOM, render the modal element, and
       * return it for use in place or within a portal.
       */
      const rendered = this.renderModal()
      if (isDOM && isDefined(mountPointSelector)) {
        const mountPoint = getMountPoint(mountPointSelector)
        if (isDefined(mountPoint)) {
          return ReactDOM.createPortal(rendered, mountPoint)
        }
      }

      /**
       * If we cant find a mount point, just return the rendered element so we
       * can provide something to use for server-side rendering.
       */
      return rendered
    }

    return null
  }
}
