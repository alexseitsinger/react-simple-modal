export function applyStyle(element, style) {
	for (var key in style) {
		if (style.hasOwnProperty(key)) {
			var value = style[key]
			element.style[key] = value
		}
	}
}

export function isPositionFixed(el) {
	if (el.style && el.style.position && el.style.position === "fixed") {
		return true
	}
	return false
}

export function removeStyle(element, style) {
	for (var key in style) {
		if (style.hasOwnProperty(key)) {
			element.style.removeProperty(key)
		}
	}
}

export const fixedElStyle = {
	position: "fixed",
	width: "100%"
}
