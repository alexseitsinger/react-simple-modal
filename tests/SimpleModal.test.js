import React from "react"

import { SimpleModal } from "../src/simple-modal"
import { SimpleModalCloseButton } from "../src/simple-modal-close-button"
import { Window, Foreground } from "../src/simple-modal-body/elements"


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

function setup(props) {
  const finalProps = {
    ...defaultProps,
    ...props,
  }
  return mount(
    <SimpleModal {...finalProps}>
      <div>test content</div>
    </SimpleModal>
  )
}

describe("<SimpleModal/>", () => {
  test("renders nothing when not visible", () => {
    const wrapper = setup({
      isVisible: false,
    })
    expect(wrapper.isEmptyRender()).toEqual(true)
  })
  test("renders without a close button", () => {
    const wrapper = setup({
      isVisible: true,
      closeButtonVisible: false,
    })
    expect(wrapper.find(SimpleModalCloseButton)).toHaveLength(0)
  })
  test("renders a close button in window", () => {
    const wrapper = setup({
      isVisible: true,
      closeButtonVisible: true,
      closeButtonPosition: "window",
    })
    const closeButton = wrapper.find(SimpleModalCloseButton)
    const parent = closeButton.parents().first()
    expect(parent.containsMatchingElement(Window)).toEqual(true)
  })
  test("renders a close button in foreground", () => {
    const wrapper = setup({
      isVisible: true,
      closeButtonVisible: true,
      closeButtonPosition: "foreground",
    })
    const closeButton = wrapper.find(SimpleModalCloseButton)
    const parent = closeButton.parents().first()
    expect(parent.containsMatchingElement(Foreground)).toEqual(true)
  })
  test("renders test content in the window", () => {
    const wrapper = setup({
      isVisible: true,
    })
    expect(wrapper.find(Window).contains(<div>test content</div>)).toEqual(true)
  })
})
