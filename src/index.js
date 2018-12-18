import React from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import { debounce } from "debounce"

import {
	documentExists,
	windowExists,
	fixedStyle,
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
		isVisible: PropTypes.bool.isRequired,
		onEscapeKey: PropTypes.func,
		onClickBackground: PropTypes.func,
		containerClassName: PropTypes.string,
		layerPosition: PropTypes.string,
		defaultIndex: PropTypes.number,
		mainElementSelector: PropTypes.string,
		mountPointSelector: PropTypes.string
	}

	static defaultProps = {
		mountPointSelector: "body",
		mainElementSelector: "main",
		containerClassName: "SimpleModal",
		backgroundShade: "dark",
		closeButtonVisible: true,
		closeButtonStyle: {},
		closeButtonPosition: "foreground",
		onOpen: () => {},
		onEscapeKey: () => {},
		onClickBackground: () => {},
		layerPosition: "above",
		defaultIndex: 100,
		closeButtonBody: "close"
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
		const totalElements = this.getElements().length
		if (totalElements === 0) {
			return defaultIndex
		}
		if (layerPosition === "above") {
			return defaultIndex + totalElements
		}
		if (layerPosition === "below") {
			return defaultIndex - totalElements
		}
	}

	// Return a list of elements that have the classname "modal". Exclude any
	// elements that match the element provided as "self" argument.
	getElements = (thisElement) => {
		// Get all the elements on the page with the classname modal.
		const { containerClassName } = this.props
		const elements = getElementsByClassName(containerClassName)
		// If we got ourselves as an argument, rmeove it from the list of
		// elements we return.
		if (thisElement) {
			return elements.filter((element) => {
				return thisElement !== element
			})
		}
		// Otherwise, return them all.
		return elements
	}

	getMainElement = () => {
		const { mainElementSelector } = this.props
		return getElement(mainElementSelector)
	}

	getMountPoint = () => {
		const { mountPointSelector } = this.props
		return getElement(mountPointSelector)
	}

	// If the main element is fixed, record its top position. Then, remove the
	// fixed element style from it to add it back to the scrollable content area.
	// Then, apply the top position as 0 to reset its position within the
	// scrollable area. Then, automatically scroll the window to the top
	// position first recorded.
	unfixScrolling = (thisElement) => {
		const mainEl = this.getMainElement()
		if (mainEl) {
			if (isFixed(mainEl)) {
				// Record the current top position of the main element.
				// NOTE: Must be before everything else to capture the top position offset.)
				var top = Math.abs(Number.parseInt(mainEl.style.top))
				// Remove the styles for the fixed els.
				removeStyle(mainEl, fixedStyle)
				// Apply the style for top position reset.
				addStyle(mainEl, {
					top: "0px"
				})
				// Force the window to re-scroll to the original position.
				// NOTE: Must be the last thing to run in order to reset scrolling.
				scrollTo(top)
			}
		}
		this.getElements(thisElement).forEach((thatElement) => {
			if (isFixed(thatElement)) {
				removeStyle(thatElement, fixedStyle)
			}
		})
	}

	// If the main element is not fixed, record the yOffset, and then apply fixed
	// position to it to remove it from the scollable area. Then record the top
	// position of the main element, if it's greater than 0, move the main element
	// top offset to be the inverse of that number to make it match the scroll
	// position of the widnow before the modal opened.
	fixScrolling = (thisElement) => {
		const mainEl = this.getMainElement()
		if (mainEl) {
			if (!isFixed(mainEl)) {
				// Record the window position before we fix the element.
				const yOffset = windowExists
					? Math.abs(Number.parseInt(window.pageYOffset))
					: 0
				// Fix the main element to remove scrolling.
				addStyle(mainEl, fixedStyle)
				// Get the top position of the main element.
				const top = parseInt(mainEl.style.top)
				// If the top position is not greater than 0, apply a negative top offset to move it up when the modal is opened.
				if (!(top > 0)) {
					addStyle(mainEl, {
						top: "-" + yOffset + "px"
					})
				}
			}
		}
		this.getElements(thisElement).forEach((thatElement) => {
			if (!isFixed(thatElement)) {
				addStyle(thatElement, fixedStyle)
			}
		})
	}

	render() {
		const {
			children,
			isVisible,
			containerClassName,
			backgroundShade,
			onOpen,
			onClose,
			closeButtonStyle,
			closeButtonPosition,
			closeButtonVisible,
			closeButtonBody,
			onClickBackground
		} = this.props
		if (isVisible) {
			const mountPoint = this.getMountPoint()
			const modalBody = (
				<Body
					onMount={(thisElement) => {
						this.fixScrolling(thisElement)
						const layerIndex = this.getLayerIndex()
						addStyle(thisElement, {
							zIndex: layerIndex
						})
						onOpen()
					}}
					onUnmount={(thisElement) => {
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
			return ReactDOM.createPortal(modalBody, mountPoint)
		} else {
			// Remove fixed styles from all the elements.
			this.unfixScrolling()
			// Dont return any rendered element since its not visible.
			return null
		}
	}
}

export default SimpleModal
