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

export const ModalForeground = styled.div`
	z-index: 4;
	display: flex;
	flex-direction: row;
	justify-content: center;
	align-items: center;
	height: 100%;
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
	${(props) =>
		props.backgroundShade === "dark" &&
		css`
			background-color: rgba(22, 22, 22, 0.5);
		`} ${(props) =>
		props.backgroundShade === "light" &&
		css`
			background-color: rgba(255, 255, 255, 0.5);
		`};
`

export const ModalCloseButton = styled.button`
	position: fixed;
	top: 0;
	right: 0;
	z-index: 2;
	margin-right: 1.5rem;
	margin-top: 1.5rem;
	${(props) =>
		props.backgroundShade == "dark" &&
		css`
			color: #eee;
		`} ${(props) =>
		props.backgroundShade == "light" &&
		css`
			color: #222;
		`};
`

export const ModalWindow = styled.div`
	height: 100%;
	width: 100%;
`

export const ModalWindowContent = styled.div``
