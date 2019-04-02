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
	getElements,
	getElement,
	isEscapeKey,
	addEventListener,
	removeEventListener,
	scrollTo
} from "../../utils"
import Body from "../body"

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

	constructor(props) {
		super(props)
		props.emitter.emit("SIMPLE_MODAL/ADD_INSTANCE", this)
	}

	// When the document has a keydown event, debounce the event until the last
	// one. Then, check if it's the ESC key. If it is, check if we got a prop
	// called onEscapeKey, and invoke it if so.
	// handleKeyDown = debounce((event) => {
	// 	if (isEscapeKey(event.which)) {
	// 		this.props.onEscapeKey()
	// 	}
	// }, 500)

	componentWillUnmount() {
		// removeEventListener("keydown", this.handleKeyDown)
		this.props.emitter.emit("SIMPLE_MODAL/REMOVE_INSTANCE", this)
	}

	// componentDidMount() {
		// addEventListener("keydown", this.handleKeyDown)
	// }

	// getLayerIndex = () => {
	// 	const { layerPosition, defaultIndex } = this.props
	// 	const totalInstances = this.getInstances().length
	// 	if (totalInstances === 0) {
	// 		return defaultIndex
	// 	}
	// 	if (layerPosition === "above") {
	// 		return defaultIndex + totalInstances
	// 	}
	// 	if (layerPosition === "below") {
	// 		return defaultIndex - totalInstances
	// 	}
	// }

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
			emitter,
			children
		} = this.props
		return (
			<Body
				onMount={(body) => {
					emitter.emit("SIMPLE_MODAL/DISABLE_SCROLLING", this)
					console.log(this.mountPoint.props.instances.length)
					// addStyle(body, {
					// 	zIndex: this.getLayerIndex()
					// })
					onOpen()
				}}
				onUnmount={(body) => {
					emitter.emit("SIMPLE_MODAL/ENABLE_SCROLLING", this)
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
		const { isVisible, emitter } = this.props
		if (isVisible) {
			return ReactDOM.createPortal(this.renderBody(), this.mountPoint)
		}
		emitter.emit("SIMPLE_MODAL/ENABLE_SCROLLING")
		return null
	}
}

export default SimpleModal
