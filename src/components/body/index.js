import React from "react"
import PropTypes from "prop-types"

import { Container, Foreground, Background, Window } from "./elements"
import CloseButton from "../close-button"

class Body extends React.Component {
	static propTypes = {
		children: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.node),
			PropTypes.node
		]).isRequired,
		onMount: PropTypes.func.isRequired,
		onUnmount: PropTypes.func.isRequired,
		backgroundShade: PropTypes.string.isRequired,
		onClickBackground: PropTypes.func.isRequired,
		onClickCloseButton: PropTypes.func.isRequired,
		closeButtonStyle: PropTypes.object.isRequired,
		closeButtonPosition: PropTypes.string.isRequired,
		closeButtonVisible: PropTypes.bool.isRequired,
		closeButtonBody: PropTypes.oneOfType([
			PropTypes.arrayOf(PropTypes.node),
			PropTypes.node
		]).isRequired,
		containerClassName: PropTypes.string.isRequired
	}
	elementRef = React.createRef()
	componentDidMount() {
		// invoke the mount callback after a timeout to allow for DOM updates.
		this.props.onMount(this.elementRef.current)
	}
	componentWillUnmount() {
		this.props.onUnmount(this.elementRef.current)
	}
	renderCloseButton = () => {
		const {
			closeButtonVisible,
			closeButtonPosition,
			backgroundShade,
			closeButtonStyle,
			onClickCloseButton,
			closeButtonBody
		} = this.props
		return closeButtonVisible ? (
			<CloseButton
				position={closeButtonPosition}
				shade={backgroundShade}
				style={closeButtonStyle}
				onClick={onClickCloseButton}>
				{closeButtonBody}
			</CloseButton>
		) : null
	}
	render() {
		const {
			children,
			backgroundShade,
			onClickBackground,
			closeButtonPosition,
			containerClassName
		} = this.props
		const renderedCloseButton = this.renderCloseButton()
		const renderedForegroundCloseButton =
			closeButtonPosition === "foreground" ? renderedCloseButton : null
		const renderedWindowCloseButton =
			closeButtonPosition === "window" ? renderedCloseButton : null
		return (
			<Container ref={this.elementRef} className={containerClassName}>
				<Background shade={backgroundShade} onClick={onClickBackground} />
				<Foreground>
					{renderedForegroundCloseButton}
					<Window>
						{renderedWindowCloseButton}
						{children}
					</Window>
				</Foreground>
			</Container>
		)
	}
}

export default Body
