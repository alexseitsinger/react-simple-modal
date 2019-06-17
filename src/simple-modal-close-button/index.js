import React from "react"
import PropTypes from "prop-types"

import { Button } from "./elements"

export function SimpleModalCloseButton({
  position, shade, style, onClick, children,
}) {
  return (
    <Button position={position} shade={shade} style={style} onClick={onClick}>
      {children}
    </Button>
  )
}
