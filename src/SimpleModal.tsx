import React, { ReactElement } from "react"
import ReactDOM from "react-dom"
import FocusLock from "react-focus-lock"
// @ts-ignore
import stylePropType from "react-style-proptype"
import PropTypes from "prop-types"
import { debounce, throttle } from "underscore"

import { Background, Button, Container, Content, Foreground } from "./elements"
import {
  addEvent,
  addStyle,
  disableScrollingOnMainElement,
  disableScrollingOnOtherInstances,
  documentExists,
  enableScrollingOnMainElement,
  enableScrollingOnOtherInstances,
  getLayerIndex,
  getMainElement,
  getMountPoint,
  isEscapeKey,
  removeEvent,
} from "./utils"

import { SimpleModalProps } from ".."

export class SimpleModal extends React.Component<SimpleModalProps> {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]).isRequired,
    backgroundShade: PropTypes.string,
    isCloseButtonVisible: PropTypes.bool,
    closeButtonStyle: stylePropType,
    closeButtonPosition: PropTypes.string,
    closeButtonBody: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node,
    ]),
    onClickCloseButton: PropTypes.func,
    onClose: PropTypes.func.isRequired,
    onOpen: PropTypes.func,
    isVisible: PropTypes.bool,
    onEscapeKey: PropTypes.func,
    onClickBackground: PropTypes.func,
    containerClassName: PropTypes.string,
    layerPosition: PropTypes.string,
    defaultIndex: PropTypes.number,
    mainElementSelector: PropTypes.string,
    mountPointSelector: PropTypes.string,
  }

  static defaultProps = {
    isVisible: true,
    mountPointSelector: "document.body",
    mainElementSelector: "main",
    containerClassName: "SimpleModal",
    backgroundShade: "dark",
    isCloseButtonVisible: true,
    closeButtonStyle: {},
    closeButtonPosition: "foreground",
    closeButtonBody: "close",
    onClickCloseButton: () => {},
    onOpen: () => {},
    onEscapeKey: () => {},
    onClickBackground: () => {},
    layerPosition: "above",
    defaultIndex: 100,
  }

  componentDidMount(): void {
    addEvent("keydown", this.handleKeyDown)
  }

  componentWillUnmount(): void {
    removeEvent("keydown", this.handleKeyDown)
  }

  elementRef = React.createRef<HTMLDivElement>()

  // When the document has a keydown event, debounce the event until the last
  // one. Then, check if it's the ESC key. If it is, check if we got a prop
  // called onEscapeKey, and invoke it if so.
  handleKeyDown = debounce((e: KeyboardEvent): void => {
    const { isVisible, onEscapeKey } = this.props

    if (isEscapeKey(e.which)) {
      if (isVisible === true) {
        if (onEscapeKey) {
          onEscapeKey()
        }
      }
    }
  }, 250)

  handleMount = throttle(() => {
    const {
      onOpen,
      layerPosition,
      defaultIndex,
      containerClassName,
    } = this.props
    const { current } = this.elementRef
    if (!current) {
      return
    }

    this.disableScrolling(current)

    addStyle(current, {
      zIndex: getLayerIndex(layerPosition, defaultIndex, containerClassName),
    })

    if (onOpen) {
      onOpen()
    }
  }, 500)

  enableScrolling = (instance?: HTMLElement) => {
    const { mainElementSelector, containerClassName } = this.props
    const mainElement = getMainElement(mainElementSelector)
    if (mainElement) {
      enableScrollingOnMainElement(mainElement)
    }
    enableScrollingOnOtherInstances(containerClassName, instance)
  }

  disableScrolling = (instance?: HTMLElement) => {
    const { mainElementSelector, containerClassName } = this.props
    const mainElement = getMainElement(mainElementSelector)
    if (mainElement) {
      disableScrollingOnMainElement(mainElement)
    }
    disableScrollingOnOtherInstances(containerClassName, instance)
  }

  renderBody = () => {
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

    this.handleMount()

    const renderedCloseButton = isCloseButtonVisible ? (
      <Button
        css={closeButtonStyle}
        position={closeButtonPosition}
        shade={backgroundShade}
        onClick={onClickCloseButton}>
        {closeButtonBody}
      </Button>
    ) : null
    const renderedForegroundCloseButton =
      closeButtonPosition === "foreground" ? renderedCloseButton : null
    const renderedWindowCloseButton =
      closeButtonPosition === "window" ? renderedCloseButton : null
    const zIndex = getLayerIndex(
      layerPosition,
      defaultIndex,
      containerClassName
    )
    return (
      <FocusLock>
        <Container
          ref={this.elementRef}
          className={containerClassName}
          zIndex={zIndex}>
          <Background
            backgroundShade={backgroundShade}
            onClick={onClickBackground}
          />
          <Foreground>
            {renderedForegroundCloseButton}
            <Content>
              {renderedWindowCloseButton}
              {children}
            </Content>
          </Foreground>
        </Container>
      </FocusLock>
    )
  }

  render(): ReactElement | null {
    const { isVisible, mountPointSelector } = this.props

    if (isVisible) {
      const renderedBody = this.renderBody()
      if (documentExists) {
        const mountPoint = getMountPoint(mountPointSelector)
        if (mountPoint) {
          return ReactDOM.createPortal(renderedBody, mountPoint)
        }
      }
      return renderedBody
    }

    this.enableScrolling()
    return null
  }
}
