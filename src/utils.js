export const documentExists = typeof document !== "undefined" ? true : null

export const windowExists = typeof document !== "undefined" ? true : null

export const fixedStyle = {
	position: "fixed",
	width: "100%"
}

export function isFixed(el) {
	if (el.style && el.style.position && el.style.position === "fixed") {
		return true
	}
}

export function addStyle(element, style) {
	for (var key in style) {
		if (style.hasOwnProperty(key)) {
			var value = style[key]
			element.style[key] = value
		}
	}
}

export function removeStyle(element, style) {
	for (var key in style) {
		if (style.hasOwnProperty(key)) {
			element.style.removeProperty(key)
		}
	}
}

export function getElementsByClassName(className) {
	if (!documentExists) {
		return []
	}
	return [].slice.call(document.getElementsByClassName(className))
}

export function getElement(selector) {
	if (!documentExists) {
		return
	}
	return document.querySelector(selector)
}

export function isEscapeKey(keyCode) {
	const escapeKeyCode = 27
	if (keyCode === escapeKeyCode) {
		return true
	}
}

export function addEventListener(name, callback) {
	if (!documentExists) {
		return
	}
	document.addEventListener(name, callback, false)
}

export function removeEventListener(name, callback) {
	if (!documentExists) {
		return
	}
	document.removeEventListener(name, callback, false)
}

export function scrollTo(position) {
	if (!windowExists) {
		return
	}
	window.scrollTo(0, position)
}
