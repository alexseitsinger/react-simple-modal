import React from "react"
import PropTypes from "prop-types"

import { Container } from "./elements"

function Body({ children, layerIndex, containerClassName }) {
	return (
		<Container className={containerClassName} zIndex={layerIndex}>
			{children}
		</Container>
	)
}

export default Body
