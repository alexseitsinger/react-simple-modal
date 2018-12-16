import React from "react"
import { shallow, mount, render } from "enzyme"

import SimpleModal from "./src"
import CloseButton from "./src/components/close-button"
import { Window, Foreground } from "./src/components/body/elements"

function setup(props) {
	return mount(
		<SimpleModal {...props}>
			<div>test content</div>
		</SimpleModal>
	)
}

const defaultProps = {
	backgroundShade: "dark",
	closeButtonStyle: {},
	closeButtonVisible: true,
	closeButtonPosition: "window",
	closeButtonBody: "close",
	onClose: () => {
		console.log("closing")
	},
	onOpen: () => {
		console.log("opening")
	},
	isVisible: true,
	onEscapeKey: () => {
		console.log("escape key")
	},
	onClickBackground: () => {
		console.log("clicked background")
	},
	containerClassName: "SimpleModal",
	layerPosition: "above",
	defaultIndex: 100,
	mainElementSelector: "main",
	mountPointSelector: "body"
}

describe("<SimpleModal/>", () => {
	test("renders nothing", () => {
		const props = Object.assign({}, defaultProps, {
			isVisible: false
		})
		const wrapper = setup(props)
		expect(wrapper.isEmptyRender()).toEqual(true)
	})
	test("renders without a close button", () => {
		const props = Object.assign({}, defaultProps, {
			isVisible: true,
			closeButtonVisible: false
		})
		const wrapper = setup(props)
		expect(wrapper.find(CloseButton)).toHaveLength(0)
	})
	test("renders a close button in window", () => {
		const props = Object.assign({}, defaultProps, {
			isVisible: true,
			closeButtonVisible: true,
			closeButtonPosition: "window"
		})
		const wrapper = setup(props)
		const closeButton = wrapper.find(CloseButton)
		const parent = closeButton.parents().first()
		expect(parent.containsMatchingElement(Window)).toEqual(true)
	})
	test("renders a close button in foreground", () => {
		const props = Object.assign({}, defaultProps, {
			isVisible: true,
			closeButtonVisible: true,
			closeButtonPosition: "foreground"
		})
		const wrapper = setup(props)
		const closeButton = wrapper.find(CloseButton)
		const parent = closeButton.parents().first()
		expect(parent.containsMatchingElement(Foreground)).toEqual(true)
	})
	test("renders test content in the window", () => {
		const props = Object.assign({}, defaultProps, {
			isVisible: true
		})
		const wrapper = setup(props)
		expect(wrapper.find(Window).contains(<div>test content</div>)).toEqual(true)
	})
})
