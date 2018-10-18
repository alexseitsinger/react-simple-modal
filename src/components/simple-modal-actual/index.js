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
		closeButtonIcon: PropTypes.object.isRequired
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
	render() {
		const {
			children,
			backgroundShade,
			onClickBackground,
			onClickCloseButton,
			closeButtonStyle,
			closeButtonPosition,
			closeButtonIconSize,
			closeButtonIcon
		} = this.props
		const closeButton = (
			<ModalCloseButton
				position={closeButtonPosition}
				backgroundShade={backgroundShade}
				style={closeButtonStyle}
				onClick={onClickCloseButton}>
				<FontAwesomeIcon icon={closeButtonIcon} size={closeButtonIconSize} />
			</ModalCloseButton>
		)
		return (
			<Modal
				className={"modal"}
				innerRef={(el) => {
					this.MODAL = el
				}}>
				<ModalBackground
					backgroundShade={backgroundShade}
					onClick={onClickBackground}
				/>
				<ModalForeground>
					{closeButtonPosition === "foreground" ? closeButton : null}
					<ModalContent>
						{closeButtonPosition === "content"
							? React.Children.count(children)
								? closeButton
								: null
							: null}
						<ModalContentInner>{children}</ModalContentInner>
					</ModalContent>
				</ModalForeground>
			</Modal>
		)
	}
}

export default SimpleModalActual
