import React from "react"
import PropTypes from "prop-types"

// import { Container, Foreground, Background, Window } from "./elements"
// import { Container } from "./elements"
import CloseButton from "../close-button"
// import { Wrapper } from "./elements"
import { Container } from "./els"

export default function ModalBody({
	containerClassName,
	layerIndex,
	children
}) {
	return <Container>{children}</Container>
}

// class ModalBody extends React.Component {
// 	// static propTypes = {
// 	// 	children: PropTypes.oneOfType([
// 	// 		PropTypes.arrayOf(PropTypes.node),
// 	// 		PropTypes.node
// 	// 	]).isRequired,
// 	// 	onDidMount: PropTypes.func.isRequired,
// 	// 	onWillUnmount: PropTypes.func.isRequired,
// 	// 	backgroundShade: PropTypes.string.isRequired,
// 	// 	onClickBackground: PropTypes.func.isRequired,
// 	// 	onClickCloseButton: PropTypes.func.isRequired,
// 	// 	closeButtonStyle: PropTypes.object.isRequired,
// 	// 	closeButtonPosition: PropTypes.string.isRequired,
// 	// 	closeButtonVisible: PropTypes.bool.isRequired,
// 	// 	closeButtonBody: PropTypes.oneOfType([
// 	// 		PropTypes.arrayOf(PropTypes.node),
// 	// 		PropTypes.node
// 	// 	]).isRequired,
// 	// 	containerClassName: PropTypes.string.isRequired,
// 	// 	layerIndex: PropTypes.number.isRequired
// 	// }
// 	// constructor(props) {
// 	// 	super(props)
// 	// 	this.ELEMENT = null
// 	// }
// 	// componentDidMount() {
// 	// 	this.props.onDidMount(this.ELEMENT)
// 	// }
// 	// componentWillUnmount() {
// 	// 	this.props.onWillUnmount(this.ELEMENT)
// 	// }
// 	// renderCloseButton = () => {
// 	// 	const {
// 	// 		closeButtonVisible,
// 	// 		closeButtonPosition,
// 	// 		backgroundShade,
// 	// 		closeButtonStyle,
// 	// 		onClickCloseButton,
// 	// 		closeButtonBody
// 	// 	} = this.props
// 	// 	return closeButtonVisible ? (
// 	// 		<CloseButton
// 	// 			position={closeButtonPosition}
// 	// 			shade={backgroundShade}
// 	// 			style={closeButtonStyle}
// 	// 			onClick={onClickCloseButton}>
// 	// 			{closeButtonBody}
// 	// 		</CloseButton>
// 	// 	) : null
// 	// }
// 	render() {
// 		const {
// 			children,
// 			// backgroundShade,
// 			// onClickBackground,
// 			// closeButtonPosition,
// 			containerClassName,
// 			layerIndex
// 		} = this.props
// 		// const renderedCloseButton = this.renderCloseButton()
// 		// const renderedForegroundCloseButton =
// 		// 	closeButtonPosition === "foreground" ? renderedCloseButton : null
// 		// const renderedWindowCloseButton =
// 		// 	closeButtonPosition === "window" ? renderedCloseButton : null
// 		return <Container>{children}</Container>
// 	}
// }
//
// export default ModalBody
