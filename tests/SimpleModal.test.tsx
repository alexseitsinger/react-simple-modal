import React, { ReactElement, ReactNode } from "react"
import { configure, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
import waitForExpect from "wait-for-expect"

configure({ adapter: new Adapter() })

import { SimpleModal, SimpleModalProvider } from "src"
import { SimpleModalInner } from "src/SimpleModalInner"

/**
 * To test:
 * - Confirm that onClose & onOpen are called at the right time.
 */

const onClose = (): void => {
  console.log("close")
}

interface Props {
  isVisible: boolean;
  onClose: () => void;
  isCloseButtonVisible?: boolean;
}

const ModalContent = (): ReactElement => {
  return <div>Content</div>
}

const App = (props: Props): ReactElement => (
  <SimpleModalProvider>
    <div id={"app"}>
      <div id={"content"}>Regular content</div>
      <SimpleModal mountPointSelector={"document.body"} {...props}>
        <ModalContent />
      </SimpleModal>
    </div>
  </SimpleModalProvider>
)

describe("SimpleModal", () => {
  it("should render null when isVisible is false", () => {
    const wrapper = mount(<App isVisible={false} onClose={onClose} />)

    expect(wrapper.find(App)).toHaveLength(1)
    expect(wrapper.find(SimpleModalInner)).toHaveLength(0)
  })

  it("should add/remove fixed styles to main element when isVisible changes", () => {
    const wrapper = mount(
      <App isVisible={true} onClose={onClose} isCloseButtonVisible={false} />
    )

    expect(wrapper.find(App)).toHaveLength(1)
    expect(wrapper.find(SimpleModalInner)).toHaveLength(1)

    expect(wrapper.find("#app").prop("style")).toHaveProperty(
      "position",
      "fixed"
    )

    // Then check that the fixed styl eis removed when isVisible changes.
    wrapper.setProps({
      isVisible: false,
    })

    wrapper.update()

    expect(wrapper.find(SimpleModalInner)).toHaveLength(0)
    expect(wrapper.find("#app").prop("style")).toStrictEqual({ top: 0 })
  })
})
