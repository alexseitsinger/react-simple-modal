import { jsx, css } from "@emotion/core"
import styled from "@emotion/styled"

export const Button = styled.button`
	${(props) => props.position === "foreground" ? css`
		position: fixed;
	` : css`
		position: absolute;
	`}
  top: 0;
	right: 0;
	z-index: 2;
	${(props) =>
		props.position === "foreground" &&
		props.shade === "dark" &&
		css`
			color: #EEE;
		`
	}
	${(props) =>
		props.position === "foreground" &&
		props.shade === "light" &&
		css`
			color: #222;
		`
	}
	${(props) =>
		props.position === "content" &&
		props.shade === "dark" &&
		css`
			color: #222;
		`
	}
	${(props) =>
		props.position === "content" &&
		props.shade === "light" &&
		css`
			color: #EEE;
		`
	}
`
