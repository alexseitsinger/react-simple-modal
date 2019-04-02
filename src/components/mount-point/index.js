import React from "react"
import PropTypes from "prop-types"

import {
	Container
} from "./elements"
import {
	getElement,
	isFixed,
	getYOffset,
	addStyle,
	removeStyle,
	getFixedStyle,
	getTopOffset,
	defaultFixedStyle,
	scrollTo,
} from "../../utils"

class SimpleModalMountPoint extends React.Component {
	static propTypes = {
		listeners: PropTypes.object.isRequired,
		addListener: PropTypes.func.isRequired,
		removeListener: PropTypes.func.isRequired,
		instances: PropTypes.array.isRequired,
		onAddInstance: PropTypes.func.isRequired,
		onRemoveInstance: PropTypes.func.isRequired,
		mainElementSelector: PropTypes.string,
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
	disableScrollingOnOtherInstances = (exclude) => {
		var instances = this.props.instances
		if(exclude){
			instances = instances.filter((inst) => {
				return (inst !== exclude)
			})
		}
		instances.forEach((inst) => {
			if (!isFixed(inst)) {
				addStyle(inst, defaultFixedStyle)
			}
		})
	}
	enableScrollingOnOtherInstances = (exclude) => {
		var instances = this.props.instances
		if(exclude){
			instances = instances.filter((inst) => {
				return (inst !== exclude)
			})
		}
		instances.forEach((inst) => {
			if (isFixed(inst)) {
				removeStyle(inst, defaultFixedStyle)
			}
		})
	}
	onEnableScrolling = (instance) => {
		this.enableScrollingOnMainElement()
		this.enableScrollingOnOtherInstances(instance)
	}
	onDisableScrolling = (instance) => {
		this.disableScrollingOnMainElement()
		this.disableScrollingOnOtherInstances(instance)
	}
	onAddInstance = (instance) => {
		const { onAddInstance } = this.props
		instance.mountPoint = this
		onAddInstance(instance)
	}
	onRemoveInstance = (instance) => {
		const { onRemoveInstance } = this.props
		onRemoveInstance(instance)
	}
	addListeners = () => {
		const { addListener } = this.props
		addListener(
			"add", "SIMPLE_MODAL/ADD_INSTANCE", this.onAddInstance)
		addListener(
			"remove", "SIMPLE_MODAL/REMOVE_INSTANCE", this.onRemoveInstance)
		addListener(
			"fix", "SIMPLE_MODAL/DISABLE_SCROLLING", this.onDisableScrolling)
		addListener(
			"unfix", "SIMPLE_MODAL/ENABLE_SCROLLING", this.onEnableScrolling)
	}
	removeListeners = () => {
		const { listeners, removeListener } = this.props
		Object.keys(listeners).forEach(removeListener)
	}
	componentDidMount() {
		this.addListeners()
	}
	componentWillUnmount() {
		this.removeListeners()
	}
	render() {
		return (
			<Container/>
		)
	}
}

SimpleModalMountPoint.propTypes = {

}

export default SimpleModalMountPoint