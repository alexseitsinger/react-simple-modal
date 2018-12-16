import { jsx, css } from "@emotion/core"
import styled from "@emotion/styled"

export const Wrapper = styled.div`
	background-color: red;
`

// export const Container = styled.div`
// 	position: absolute;
// 	min-height: 100%;
// 	width: 100%;
// 	top: 0;
// 	left: 0;
// 	${props => props.zIndex && css`
// 		z-index: ${props.zIndex};
// 	`}
// 	display: flex;
// 	align-items: center;
// 	justify-content: center;
// `

// export const Background = styled.div`
// 	position: absolute;
// 	top: 0;
// 	left: 0;
// 	width: 100%;
// 	min-height: 100%;
// 	z-index: 3;
// 	${(props) => props.shade === "dark" && css`
// 		background-color: rgba(22, 22, 22, 0.5);
// 	`}
// 	${(props) => props.shade === "light" && css`
// 		background-color: rgba(255, 255, 255, 0.5);
// 	`}
// `

// export const Foreground = styled.div`
// 	z-index: 4;
// 	display: flex;
// 	flex-direction: row;
// 	justify-content: center;
// 	align-items: center;
// 	height: 100%;
// `
//
// export const Window = styled.div`
// 	height: 100%;
// 	width: 100%;
// 	position: relative;
// `
