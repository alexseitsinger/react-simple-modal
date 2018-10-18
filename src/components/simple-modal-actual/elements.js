import styled from "react-emotion"
import { css } from "emotion"

export const Modal = styled.div`
	position: absolute;
	min-height: 100%;
	width: 100%;
	top: 0;
	left: 0;
	z-index: 20;
	display: flex;
	align-items: center;
	justify-content: center;
`

/*
	Need to include left: 0; top: 0; because safari doesnt align the modal with
	the left-edge of the screen automatically.
*/
export const ModalBackground = styled.div`
	position: absolute;
	top: 0;
	left: 0;
	width: 100%;
	min-height: 100%;
	z-index: 3;
	${(props) => props.backgroundShade === "dark" && css`
		background-color: rgba(22, 22, 22, 0.5);
	`}
	${(props) => props.backgroundShade === "light" && css`
		background-color: rgba(255, 255, 255, 0.5);
	`}
`

export const ModalForeground = styled.div`
	z-index: 4;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 100%;
`

export const ModalCloseButton = styled.button`
	${(props) => props.position === "foreground" ? css`
		position: fixed;
		margin-right: 1.5em;
		margin-top: 1.5em;
	` : css`
		position: absolute;
		margin-right: 0.333em;
		margin-top: 0.333em;
	`}
  top: 0;
	right: 0;
	z-index: 2;
	${(props) =>
		props.position === "foreground" &&
		props.backgroundShade === "dark" &&
		css`
			color: #EEE;
		`
	}
	${(props) =>
		props.position === "foreground" &&
		props.backgroundShade === "light" &&
		css`
			color: #222;
		`
	}
	${(props) =>
		props.position === "content" &&
		props.backgroundShade === "dark" &&
		css`
			color: #222;
		`
	}
	${(props) =>
		props.position === "content" &&
		props.backgroundShade === "light" &&
		css`
			color: #EEE;
		`
	}
`

export const ModalContent = styled.div`
	height: 100%;
	width: 100%;
	position: relative;
`

export const ModalContentInner = styled.div`
	position: relative;
`
