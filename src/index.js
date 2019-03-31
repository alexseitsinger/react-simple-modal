import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import { debounce } from "debounce"

import {
	getTopOffset,
	getYOffset,
	defaultFixedStyle,
	getFixedStyle,
	isFixed,
	addStyle,
	removeStyle,
	getElementsByClassName,
	getElement,
	isEscapeKey,
	addEventListener,
	removeEventListener,
	scrollTo
} from "./utils"
import Body from "./components/body"

/**
 * @name SimpleModal
 * @description A modal that can be used with react redux.
 * @param {object} props
 * @param {Node|Array} props.children - The child elements to render.
 * @param {String} [props.backgroundShade=dark] - The background shade to use.
 * @param {Boolean} [props.closeButtonVisible=true] - Determine if the close button is visible.
 * @param {Object} [props.closeButtonStyle={}] - Extra style to apply to the close button.
 * @param {String} [props.closeButtonPosition=foreground] - The position of the close button.
 * @param {Node|Array} [props.closeButtonBody=close] - The body of the close button.
 * @param {Function} props.onClose - The function to invoke when the modal closes.
 * @param {Function} [props.onOpen=() => {}] - The function to invoke when the modal opens.
 * @param {Boolean} props.isVisible - Determines if the modal is rendered into the DOM.
 * @param {Function} [props.onEscapeKey=() => {}] - The function to invoke when then esacpe key is pressed.
 * @param {Function} [props.onClickBackground=() => {}] - The function to invoke when the background of the modal is clicked.
 * @param {String} [props.containerClassName=SimpleModal] - The classname to use for the modal container element.
 * @param {String} [props.layerPosition=above] - The layer position to use for the zIndex.
 * @param {Number} [props.defaultIndex=100] - The default zIndex to start from.
 * @param {String} [props.mainElementSelector=main] - The selector to use to find the main element in the DOM.
 * @param {String} [props.mountPointSelector=body] - The selector to use to find the mount point element in the DOM>
 * @example
 * <SimpleModal
 *   isVisible={true}
 *   closeButtonPosition={"window"}
 *   onClose={() => {
 *     doClose()
 *   }}
 *   onEscapeKey={() => {
 *     doClose()
 *   }}>
 *   <div>An example modal body</div>
 * </SimpleModal>
 */
class SimpleModal extends React.Component {
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
		mountPointSelector: PropTypes.string
	}

	static defaultProps = {
		isVisible: true,
		mountPointSelector: "body",
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
	handleKeyDown = debounce((event) => {
		if (isEscapeKey(event.which)) {
			this.props.onEscapeKey()
		}
	}, 500)

	componentWillUnmount() {
		removeEventListener("keydown", this.handleKeyDown)
	}

	componentDidMount() {
		addEventListener("keydown", this.handleKeyDown)
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

	// Return a list of elements that have the classname "modal". Exclude any
	// elements that match the element provided as "self" argument.
	getInstances = (excludedInstance) => {
		// Get all the elements on the page with the classname modal.
		const { containerClassName } = this.props
		const instances = getElementsByClassName(containerClassName)
		// If we got ourselves as an argument, rmeove it from the list of
		// elements we return.
		if (excludedInstance) {
			return instances.filter((instance) => {
				return excludedInstance !== instance
			})
		}
		// Otherwise, return them all.
		return instances
	}

	getMainElement = () => {
		const { mainElementSelector } = this.props
		return getElement(mainElementSelector)
	}

	getMountPoint = () => {
		const { mountPointSelector } = this.props
		return getElement(mountPointSelector)
	}

	unfixMainElement = () => {
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

	// If the main element is fixed, record its top position. Then, remove the
	// fixed element style from it to add it back to the scrollable content area.
	// Then, apply the top position as 0 to reset its position within the
	// scrollable area. Then, automatically scroll the window to the top
	// position first recorded.
	unfixScrolling = (thisInstance) => {
		this.unfixMainElement()
		this.unfixOtherInstances(thisInstance)
	}

	unfixOtherInstances = (thisInstance) => {
		this.getInstances(thisInstance).forEach((thatInstance) => {
			if (isFixed(thatInstance)) {
				removeStyle(thatInstance, defaultFixedStyle)
			}
		})
	}

	fixMainElement = () => {
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

	fixOtherInstances = (thisInstance) => {
		this.getInstances(thisInstance).forEach((thatInstance) => {
			if (!isFixed(thatInstance)) {
				addStyle(thatInstance, defaultFixedStyle)
			}
		})
	}

	// If the main element is not fixed, record the yOffset, and then apply fixed
	// position to it to remove it from the scollable area. Then record the top
	// position of the main element, if it's greater than 0, move the main element
	// top offset to be the inverse of that number to make it match the scroll
	// position of the widnow before the modal opened.
	fixScrolling = (thisInstance) => {
		this.fixMainElement()
		this.fixOtherInstances(thisInstance)
	}

	renderBody = () => {
		const {
			containerClassName,
			onOpen,
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
			<Body
				onMount={(thisInstance) => {
					this.fixScrolling(thisInstance)
					addStyle(thisInstance, {
						zIndex: this.getLayerIndex()
					})
					onOpen()
				}}
				onUnmount={(thisInstance) => {
					this.unfixScrolling()
				}}
				containerClassName={containerClassName}
				onClickCloseButton={onClose}
				onClickBackground={onClickBackground}
				closeButtonVisible={closeButtonVisible}
				closeButtonStyle={closeButtonStyle}
				closeButtonBody={closeButtonBody}
				closeButtonPosition={closeButtonPosition}
				backgroundShade={backgroundShade}>
				{children}
			</Body>
		)
	}

	render() {
		const { isVisible } = this.props
		if (isVisible) {
			const body = this.renderBody()
			const mountPoint = this.getMountPoint()
			return ReactDOM.createPortal(body, mountPoint)
		} else {
			// Remove fixed styles from all the elements.
			this.unfixScrolling()
			// Dont return any rendered element since its not visible.
			return null
		}
	}
}

export default SimpleModal
