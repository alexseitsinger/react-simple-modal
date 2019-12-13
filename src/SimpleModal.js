import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import FocusLock from "react-focus-lock"
import { debounce, uniq, throttle } from "underscore"
import computedStyle from "computed-style"

import {
  documentExists,
  getTopOffset,
  getYOffset,
  defaultFixedStyle,
  getFixedStyle,
  isFixed,
  addStyle,
  removeStyle,
  getElements,
  getElement,
  isEscapeKey,
  addEvent,
  removeEvent,
  scrollTo,
} from "./utils"
import {
  Container,
  Background,
  Foreground,
  Content,
  Button,
} from "./elements"

export class SimpleModal extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    backgroundShade: PropTypes.string,
    isCloseButtonVisible: PropTypes.bool,
    closeButtonStyle: PropTypes.object,
    closeButtonPosition: PropTypes.string,
    closeButtonBody: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]),
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
    mountPointSelector: null,
    mainElementSelector: "main",
    containerClassName: "SimpleModal",
    backgroundShade: "dark",
    isCloseButtonVisible: true,
    closeButtonStyle: {},
    closeButtonPosition: "foreground",
    closeButtonBody: "close",
    onOpen: () => {},
    onEscapeKey: () => {},
    onClickBackground: () => {},
    layerPosition: "above",
    defaultIndex: 100
  }

  // When the document has a keydown event, debounce the event until the last
  // one. Then, check if it's the ESC key. If it is, check if we got a prop
  // called onEscapeKey, and invoke it if so.
  handleKeyDown = debounce(e => {
    const { isVisible, onEscapeKey } = this.props

    if (isEscapeKey(e.which)) {
      if (isVisible === true) {
        onEscapeKey()
      }
    }
  }, 250)

  elementRef = React.createRef()

  componentWillUnmount() {
    removeEvent("keydown", this.handleKeyDown)
  }

  componentDidMount() {
    addEvent("keydown", this.handleKeyDown)
  }

  getLayerIndex = () => {
    const { layerPosition, defaultIndex } = this.props
    const totalInstances = this.getInstances().length
    if (totalInstances === 0) {
      return defaultIndex
    }
    if (layerPosition === "above") {
      return defaultIndex + totalInstances
    }
    if (layerPosition === "below") {
      return defaultIndex - totalInstances
    }
  }

  getMainElement = () => {
    const { mainElementSelector } = this.props
    return getElement(mainElementSelector)
  }

  enableScrollingOnMainElement = () => {
    const mainEl = this.getMainElement()
    if (mainEl) {
      if (isFixed(mainEl)) {
        // Record the current top position of the main element.
        // NOTE: Must be before everything else to capture the top position offset.)
        const top = getTopOffset(mainEl)
        // Remove the styles for the fixed els.
        removeStyle(mainEl, getFixedStyle(mainEl))
        // Apply the style for top position reset.
        addStyle(mainEl, {
          top: "0px"
        })
        // Force the window to re-scroll to the original position.
        // NOTE: Must be the last thing to run in order to reset scrolling.
        scrollTo(top)
      }
    }
  }

  disableScrollingOnMainElement = () => {
    const mainEl = this.getMainElement()
    if (mainEl) {
      if (!isFixed(mainEl)) {
        // Record the window position before we fix the element.
        const yOffset = getYOffset()
        // Fix the main element to remove scrolling.
        addStyle(mainEl, getFixedStyle(mainEl))
        // Get the top position of the main element.
        const top = getTopOffset(mainEl)
        // If the top position is not greater than 0, apply a negative top offset to move it up when the modal is opened.
        if (!(top > 0)) {
          addStyle(mainEl, {
            top: "-" + yOffset + "px"
          })
        }
      }
    }
  }

  getInstances = () => {
    if (!documentExists){
      return []
    }
    const { containerClassName } = this.props
    return uniq([
      ...getElements(".SimpleModal"),
      ...getElements(`.${containerClassName}`),
    ])
  }

  disableScrollingOnOtherInstances = (exclude) => {
    this.getInstances()
      .filter((inst) => {
        return (inst !== exclude)
      })
      .forEach((inst) => {
        // const el = ReactDOM.findDOMNode(inst)
        if (!isFixed(inst)) {
          addStyle(inst, defaultFixedStyle)
        }
      })
  }

  enableScrollingOnOtherInstances = (exclude) => {
    this.getInstances()
      .filter((inst) => {
        return (inst !== exclude)
      })
      .forEach((inst) => {
        // const el = ReactDOM.findDOMNode(inst)
        if (isFixed(inst)) {
          removeStyle(inst, defaultFixedStyle)
        }
      })
  }

  enableScrolling = (instance) => {
    this.enableScrollingOnMainElement()
    this.enableScrollingOnOtherInstances(instance)
  }

  disableScrolling = (instance) => {
    this.disableScrollingOnMainElement()
    this.disableScrollingOnOtherInstances(instance)
  }

  handleMountBody = throttle(() => {
    const { onOpen } = this.props
    const { current } = this.elementRef
    if (!current) {
      return
    }

    this.disableScrolling(current)

    addStyle(current, {
      zIndex: this.getLayerIndex()
    })

    onOpen()
  }, 500)

  getMinHeight = () => {
    const el = this.getMainElement()
    if (el) {
      return computedStyle(el, "height")
    }
    return "100%"
  }

  renderCloseButton = () => {
    const {
      isCloseButtonVisible,
      closeButtonPosition,
      backgroundShade,
      closeButtonStyle,
      onClickCloseButton,
      closeButtonBody
    } = this.props

    return isCloseButtonVisible ? (
      <Button
        position={closeButtonPosition}
        shade={backgroundShade}
        style={closeButtonStyle}
        onClick={onClickCloseButton}>
        {closeButtonBody}
      </Button>
    ) : null
  }

  renderBody = () => {
    const {
      children,
      zIndex,
      backgroundShade,
      onClickBackground,
      closeButtonPosition,
      containerClassName
    } = this.props

    this.handleMountBody()

    const renderedCloseButton = this.renderCloseButton()
    const renderedForegroundCloseButton =
      closeButtonPosition === "foreground" ? renderedCloseButton : null
    const renderedWindowCloseButton =
      closeButtonPosition === "window" ? renderedCloseButton : null

    return (
      <FocusLock>
        <Container
          ref={this.elementRef}
          zIndex={zIndex}
          className={containerClassName}>
          <Background
            backgroundShade={backgroundShade}
            onClick={onClickBackground} />
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

  getMountPoint = () => {
    if (documentExists) {
      const { mountPointSelector } = this.props
      if (mountPointSelector) {
        const mountPoint = document.querySelector(mountPointSelector)
        if (mountPoint) {
          return mountPoint
        }
      }
      return document.body
    }
  }

  render() {
    const { isVisible } = this.props
    if (isVisible) {
      const renderedBody = this.renderBody()
      if(documentExists){
        const mountPoint = this.getMountPoint()
        return ReactDOM.createPortal(renderedBody, mountPoint)
      }
      return renderedBody
    }
    this.enableScrolling()
    return null
  }
}
