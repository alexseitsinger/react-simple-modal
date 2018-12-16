import React from "react"
import PropTypes from "prop-types"

import { Button } from "./elements"

function CloseButton({ position, shade, style, onClick, children }) {
	return (
		<Button position={position} shade={shade} style={style} onClick={onClick}>
			{children}
		</Button>
	)
}

export default CloseButton
