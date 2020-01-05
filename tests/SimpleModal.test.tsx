import { configure, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"

configure({ adapter: new Adapter() })

import React from "react"

import { SimpleModal } from "../src"
import { Content, Foreground } from "../src/elements"

// TODO: Add test for DOM event adding/removing correctly.
// TODO: add test to ensure main element is fixed when modal is rendered &
// unfixed when modal is unmounted.

const onClose = () => {}

describe("SimpleModal", () => {
  it("renders nothing when not visible", () => {
    const wrapper = mount(
      <SimpleModal isVisible={false} onClose={onClose}>
        <div>Test</div>
      </SimpleModal>
    )

    expect(wrapper.isEmptyRender()).toStrictEqual(true)
  })

  it("renders without a close button", () => {
    const wrapper = mount(
      <SimpleModal
        isVisible={true}
        isCloseButtonVisible={false}
        onClose={onClose}>
        <div>Test</div>
      </SimpleModal>
    )

    expect(wrapper.find("button")).toHaveLength(0)
  })

  it("renders a close button in window", () => {
    const wrapper = mount(
      <SimpleModal
        isVisible={true}
        isCloseButtonVisible={true}
        closeButtonPosition={"window"}
        onClose={onClose}>
        <div>Test</div>
      </SimpleModal>
    )
    const closeButton = wrapper.find("button")
    const parentNode = closeButton.parents().first()

    expect(parentNode.containsMatchingElement(Content)).toStrictEqual(true)
  })

  it("renders a close button in foreground", () => {
    const wrapper = mount(
      <SimpleModal
        isVisible={true}
        isCloseButtonVisible={true}
        closeButtonPosition={"foreground"}
        onClose={onClose}>
        <div>Test</div>
      </SimpleModal>
    )
    const closeButton = wrapper.find("button")
    const parent = closeButton.parents().first()

    expect(parent.containsMatchingElement(Foreground)).toStrictEqual(true)
  })

  it("renders test content in the window", () => {
    const wrapper = mount(
      <SimpleModal isVisible={true} onClose={onClose}>
        <div>Test</div>
      </SimpleModal>
    )

    expect(wrapper.find(Content).contains(<div>Test</div>)).toStrictEqual(true)
  })
})
