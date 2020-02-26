import React, { ReactElement } from "react"
import { configure, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import { matchers } from "jest-emotion"

expect.extend(matchers)

configure({ adapter: new Adapter() })

/**
 * TODO: Add test to verify top is set to yoffset when rendered, and removed
 * when unrendered.
 * TODO: Test that the fixed style (with correct top position) gets re-set after
 * an update (ala RHL).
 */

import { SimpleModal, SimpleModalProvider } from "src"
//import { MainElement } from "src/elements"
import { SimpleModalWithContextProps } from "src/SimpleModalWithContext"

const ModalContent = (): ReactElement => <div>Modal Content</div>

const MainContent = (): ReactElement => <div>Main Content</div>

const App = (props: SimpleModalWithContextProps): ReactElement => (
  <SimpleModalProvider>
    <div id={"app"}>
      <div id={"main"}>
        <MainContent />
      </div>
      <SimpleModal {...props}>
        <ModalContent />
      </SimpleModal>
    </div>
  </SimpleModalProvider>
)

describe("SimpleModal", () => {
  it("should add fixed styles to main element when mounted", () => {
    const wrapper = mount(
      <App modalName={"toggled-modal"} containerClassName={"ToggledModal"} />
    )

    expect(wrapper.find(App)).toHaveLength(1)

    console.log(wrapper.html())

    expect(wrapper.find(MainContent)).toHaveLength(1)
    expect(wrapper.find(ModalContent)).toHaveLength(1)
    expect(wrapper.find("div.ToggledModal")).toHaveStyleRule("z-index", "200")
    //expect(wrapper.find(MainElement)).toHaveStyleRule("position", "fixed")
  })

  it("should use the specified z-index & have no close button by default", () => {
    const wrapper = mount(
      <App
        containerClassName={"ContainerLayerModal"}
        containerLayer={201}
        modalName={"container-layer-modal"}
      />
    )

    expect(wrapper.find(App)).toHaveLength(1)
    expect(wrapper.find(MainContent)).toHaveLength(1)
    expect(wrapper.find(ModalContent)).toHaveLength(1)
    expect(wrapper.find("div.ContainerLayerModal")).toHaveStyleRule(
      "z-index",
      "201"
    )
    expect(wrapper.find("button.SimpleModal-CloseButton")).toHaveLength(0)
  })

  it("should render a close button when specified", () => {
    const wrapper = mount(
      <App
        modalName={"close-button-modal"}
        containerClassName={"CloseButtonModal"}
        closeButtonClassName={"CloseButtonModal-CloseButton"}
        isCloseButtonVisible={true}
        renderCloseButton={(): ReactElement => {
          return <div>Close Button</div>
        }}
      />
    )

    expect(wrapper.find("button.CloseButtonModal-CloseButton")).toHaveLength(1)
    expect(wrapper.find("button.CloseButtonModal-CloseButton").html()).toMatch(
      "<div>Close Button</div>"
    )
  })
})
