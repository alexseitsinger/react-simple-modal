import React from "react"
import PropTypes from "prop-types"
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome"
import {
	Modal,
	ModalForeground,
	ModalBackground,
	ModalCloseButton,
	ModalContent,
	ModalContentInner
} from "./elements"

class SimpleModalActual extends React.Component {
	static propTypes = {
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.node),
			PropTypes.node
		]).isRequired,
		onDidMount: PropTypes.func.isRequired,
		onWillUnmount: PropTypes.func.isRequired,
		backgroundShade: PropTypes.string.isRequired,
		onClickBackground: PropTypes.func.isRequired,
		onClickCloseButton: PropTypes.func.isRequired,
		closeButtonStyle: PropTypes.object.isRequired,
		closeButtonPosition: PropTypes.string.isRequired,
		closeButtonIconSize: PropTypes.string.isRequired,
		closeButtonIcon: PropTypes.object.isRequired,
		closeButtonVisible: PropTypes.bool.isRequired,
		modalClassName: PropTypes.string.isRequired
	}
	constructor(props) {
		super(props)
		this.MODAL = null
	}
	componentDidMount() {
		this.props.onDidMount(this.MODAL)
	}
	componentWillUnmount() {
		this.props.onWillUnmount(this.MODAL)
	}
	renderCloseButton = () => {
		const {
			closeButtonPosition,
			backgroundShade,
			closeButtonStyle,
			onClickCloseButton,
			closeButtonIcon,
			closeButtonIconSize,
			closeButtonVisible
		} = this.props
		if (!closeButtonVisible) {
			return null
		}
		return (
			<ModalCloseButton
				position={closeButtonPosition}
				backgroundShade={backgroundShade}
				style={closeButtonStyle}
				onClick={onClickCloseButton}>
				<FontAwesomeIcon icon={closeButtonIcon} size={closeButtonIconSize} />
			</ModalCloseButton>
		)
	}
	render() {
		const {
			children,
			backgroundShade,
			onClickBackground,
			closeButtonPosition,
			modalClassName
		} = this.props
		const renderedCloseButton = this.renderCloseButton()
		return (
			<Modal
				className={modalClassName}
				innerRef={(el) => {
					this.MODAL = el
				}}>
				<ModalBackground
					backgroundShade={backgroundShade}
					onClick={onClickBackground}
				/>
				<ModalForeground>
					{closeButtonPosition === "foreground" ? renderedCloseButton : null}
					<ModalContent>
						{closeButtonPosition === "content" ? renderedCloseButton : null}
						{children}
					</ModalContent>
				</ModalForeground>
			</Modal>
		)
	}
}

export default SimpleModalActual
