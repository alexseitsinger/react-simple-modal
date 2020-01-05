import { CSSObject } from "@emotion/core"
// @ts-ignore
import computedStyle from "computed-style"
import PropTypes from "prop-types"
import React, { ReactElement } from "react"
import ReactDOM from "react-dom"
import FocusLock from "react-focus-lock"
// @ts-ignore
import stylePropType from "react-style-proptype"
import { debounce, throttle, uniq } from "underscore"

import { Background, Button,Container, Content, Foreground } from "./elements"
import {
  addEvent,
  addStyle,
  defaultFixedStyle,
  documentExists,
  getElement,
  getElements,
  getFixedStyle,
  getTopOffset,
  getYOffset,
  isEscapeKey,
  isFixed,
  removeEvent,
  removeStyle,
  scrollWindow,
} from "./utils"

export interface Props {
  children: React.ReactNode | React.ReactNode[];
  backgroundShade?: string;
  isCloseButtonVisible?: boolean;
  closeButtonStyle?: CSSObject;
  closeButtonPosition?: string;
  closeButtonBody?: React.ReactNode | React.ReactNode[];
  onClose: () => void;
  onOpen?: () => void;
  isVisible?: boolean;
  onEscapeKey?: () => void;
  onClickBackground?: () => void;
  containerClassName?: string;
  layerPosition?: string;
  defaultIndex?: number;
  mainElementSelector?: string;
  mountPointSelector?: string;
  onClickCloseButton?: () => void;
}

export class SimpleModal extends React.Component<Props> {
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

  componentDidMount() {
    addEvent("keydown", this.handleKeyDown)
  }

  componentWillUnmount() {
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

  handleMountBody = throttle(() => {
    const { onOpen } = this.props
    const { current } = this.elementRef
    if (!current) {
      return
    }

    this.disableScrolling(current)

    addStyle(current, {
      zIndex: this.getLayerIndex(),
    })

    if (onOpen) {
      onOpen()
    }
  }, 500)

  enableScrolling = (instance?: HTMLElement) => {
    this.enableScrollingOnMainElement()
    this.enableScrollingOnOtherInstances(instance)
  }

  disableScrolling = (instance?: HTMLElement) => {
    this.disableScrollingOnMainElement()
    this.disableScrollingOnOtherInstances(instance)
  }

  disableScrollingOnOtherInstances = (exclude?: HTMLElement) => {
    this.getInstances()
      .filter(inst => inst !== exclude)
      .forEach(inst => {
        // const el = ReactDOM.findDOMNode(inst)
        if (!isFixed(inst)) {
          addStyle(inst, defaultFixedStyle)
        }
      })
  }

  enableScrollingOnOtherInstances = (exclude?: HTMLElement) => {
    this.getInstances()
      .filter(inst => inst !== exclude)
      .forEach(inst => {
        // const el = ReactDOM.findDOMNode(inst)
        if (isFixed(inst)) {
          removeStyle(inst, defaultFixedStyle)
        }
      })
  }

  getInstances = () => {
    if (!documentExists) {
      return []
    }
    const { containerClassName } = this.props
    return uniq([
      ...getElements(".SimpleModal"),
      ...getElements(`.${containerClassName}`),
    ])
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
        const topPos = getTopOffset(mainEl)
        // If the top position is not greater than 0, apply a negative top offset to move it up when the modal is opened.
        if (!(topPos > 0)) {
          addStyle(mainEl, {
            top: `-${yOffset}px`,
          })
        }
      }
    }
  }


  enableScrollingOnMainElement = () => {
    const mainEl = this.getMainElement()
    if (mainEl) {
      if (isFixed(mainEl)) {
        // Record the current top position of the main element.
        // NOTE: Must be before everything else to capture the top position offset.)
        const topPos = getTopOffset(mainEl)
        // Remove the styles for the fixed els.
        removeStyle(mainEl, getFixedStyle(mainEl))
        // Apply the style for top position reset.
        addStyle(mainEl, {
          top: "0px",
        })
        // Force the window to re-scroll to the original position.
        // NOTE: Must be the last thing to run in order to reset scrolling.
        scrollWindow(topPos)
      }
    }
  }

  getLayerIndex = (): number => {
    const { layerPosition, defaultIndex } = this.props
    const totalInstances = this.getInstances().length
    if (totalInstances === 0) {
      return defaultIndex!
    }
    if (layerPosition === "above") {
      return defaultIndex! + totalInstances
    }
    if (layerPosition === "below") {
      return defaultIndex! - totalInstances
    }
    return defaultIndex!
  }

  getMainElement = (): HTMLElement | null => {
    const { mainElementSelector } = this.props
    if (mainElementSelector) {
      return getElement(mainElementSelector)
    }
    return null
  }

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
      closeButtonBody,
    } = this.props

    return isCloseButtonVisible ? (
      <Button
        css={closeButtonStyle}
        position={closeButtonPosition}
        shade={backgroundShade}
        onClick={onClickCloseButton}>
        {closeButtonBody}
      </Button>
    ) : null
  }

  renderBody = () => {
    const {
      children,
      backgroundShade,
      onClickBackground,
      closeButtonPosition,
      containerClassName,
    } = this.props

    this.handleMountBody()

    const renderedCloseButton = this.renderCloseButton()
    const renderedForegroundCloseButton
      = closeButtonPosition === "foreground" ? renderedCloseButton : null
    const renderedWindowCloseButton
      = closeButtonPosition === "window" ? renderedCloseButton : null

    return (
      <FocusLock>
        <Container
          ref={this.elementRef}
          className={containerClassName}>
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

  getMountPoint = (): HTMLElement | null => {
    if (documentExists) {
      const { mountPointSelector } = this.props
      if (mountPointSelector) {
        const mountPoint = getElement(mountPointSelector)
        if (mountPoint) {
          return mountPoint
        }
      }
      return document.body
    }
    return null
  }

  render(): ReactElement | null {
    const { isVisible, onClose } = this.props

    if (isVisible) {
      const renderedBody = this.renderBody()
      if (documentExists) {
        const mountPoint = this.getMountPoint()
        if (mountPoint) {
          return ReactDOM.createPortal(renderedBody, mountPoint)
        }
      }
      return renderedBody
    }

    if (onClose) {
      onClose()
    }
    this.enableScrolling()
    return null
  }
}
