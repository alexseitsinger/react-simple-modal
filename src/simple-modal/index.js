import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import { debounce } from "debounce"

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
  scrollTo
} from "./utils"
import { SimpleModalBody } from "../simple-modal-body"

/**
 * @description
 * A modal that can be used with react redux.
 *
 * @param {object} props
 * @param {node|array} props.children
 * The child elements to render.
 * @param {string} [props.backgroundShade=dark]
 * The background shade to use.
 * @param {boolean} [props.closeButtonVisible=true]
 * Determine if the close button is visible.
 * @param {object} [props.closeButtonStyle={}]
 * Extra style to apply to the close button.
 * @param {string} [props.closeButtonPosition=foreground]
 * The position of the close button.
 * @param {node|array} [props.closeButtonBody=close]
 * The body of the close button.
 * @param {function} props.onClose
 * The function to invoke when the modal closes.
 * @param {function} [props.onOpen=() => {}]
 * The function to invoke when the modal opens.
 * @param {boolean} props.isVisible
 * Determines if the modal is rendered into the DOM.
 * @param {function} [props.onEscapeKey=() => {}]
 * The function to invoke when then esacpe key is pressed.
 * @param {function} [props.onClickBackground=() => {}]
 * The function to invoke when the background of the modal is clicked.
 * @param {string} [props.containerClassName=SimpleModal]
 * The classname to use for the modal container element.
 * @param {string} [props.layerPosition=above]
 * The layer position to use for the zIndex.
 * @param {number} [props.defaultIndex=100]
 * The default zIndex to start from.
 * @param {string} [props.mainElementSelector=main]
 * The selector to use to find the main element in the DOM.
 *
 * @example
 * <SimpleModal
 *   isVisible={true}
 *   closeButtonPosition={"window"}
 *   onClose={doClose}
 *   onClickBackground={doClose}
 *   onEscapeKey={doClose}>
 *   <div>An example modal body</div>
 * </SimpleModal>
 */
export class SimpleModal extends React.Component {
  static propTypes = {
    children: PropTypes.oneOfType([
      PropTypes.arrayOf(PropTypes.node),
      PropTypes.node
    ]).isRequired,
    backgroundShade: PropTypes.string,
    closeButtonVisible: PropTypes.bool,
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
  }

  static defaultProps = {
    isVisible: true,
    mainElementSelector: "main",
    containerClassName: "SimpleModal",
    backgroundShade: "dark",
    closeButtonVisible: true,
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
  }, 500)

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
    const { containerClassName } = this.props
    return getElements(("." + containerClassName))
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

  handleMountBody = debounce(body => {
    const { onOpen } = this.props

    this.disableScrolling(body)

    addStyle(body, {
      zIndex: this.getLayerIndex()
    })

    onOpen()
  }, 400)

  handleUnmountBody = debounce(body => {
    this.enableScrolling()
  }, 400)

  renderBody = () => {
    const {
      containerClassName,
      onClose,
      onClickBackground,
      closeButtonVisible,
      closeButtonStyle,
      closeButtonBody,
      closeButtonPosition,
      backgroundShade,
      children
    } = this.props
    return (
      <SimpleModalBody
        onMount={this.handleMountBody}
        onUnmount={this.handleUnmountBody}
        containerClassName={containerClassName}
        onClickCloseButton={onClose}
        onClickBackground={onClickBackground}
        closeButtonVisible={closeButtonVisible}
        closeButtonStyle={closeButtonStyle}
        closeButtonBody={closeButtonBody}
        closeButtonPosition={closeButtonPosition}
        backgroundShade={backgroundShade}>
        {children}
      </SimpleModalBody>
    )
  }

  render() {
    const { isVisible } = this.props
    if (isVisible) {
      const renderedBody = this.renderBody()
      if(documentExists){
        return ReactDOM.createPortal(renderedBody, document.body)
      }
      return renderedBody
    }
    this.enableScrolling()
    return null
  }
}
