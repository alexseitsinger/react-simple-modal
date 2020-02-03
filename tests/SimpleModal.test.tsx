import React, { ReactElement } from "react"
import { configure, mount } from "enzyme"
import Adapter from "enzyme-adapter-react-16"
//import waitForExpect from "wait-for-expect"

configure({ adapter: new Adapter() })

import { SimpleModal, SimpleModalProvider } from "src"

/**
 * To test:
 * - Confirm that onClose & onOpen are called at the right time.
 */

const onClose = (): void => {
  console.log("close")
}

interface Props {
  onClose: () => void;
  isCloseButtonVisible?: boolean;
  modalName: string;
}

const ModalContent = (): ReactElement => {
  return <div>Content</div>
}

const App = (props: Props): ReactElement => (
  <SimpleModalProvider>
    <div id={"app"}>
      <div id={"content"}>Regular content</div>
      <SimpleModal {...props}>
        <ModalContent />
      </SimpleModal>
    </div>
  </SimpleModalProvider>
)

describe("SimpleModal", () => {
  it.only("should add fixed styles to main element when mounted", () => {
    const wrapper = mount(
      <App
        modalName={"toggled-modal"}
        onClose={onClose}
        isCloseButtonVisible={false}
      />
    )

    expect(wrapper.find(App)).toHaveLength(1)
    expect(wrapper.find("#app").prop("style")).toHaveProperty(
      "position",
      "fixed"
    )
  })
})
