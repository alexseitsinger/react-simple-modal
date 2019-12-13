## SimpleModal

A simple modal.

### Props

1. __backgroundShade__
    The background color to use for the modal background.
2. __isCloseButtonVisible__
    Determines if the close button is visible.
3. __closeButtonStyle__
    Extra css style to apply to the close button.
4. __closeButtonPosition__
    Determines where the close button should be rendered within the modal.
5. __closeButtonBody__
    The elements to use for the close button.
6. __onClose__
    Function to invoke when the modal is closed.
7. __onOpen__
    Function to invoke when the modal is opened.
8. __isVisible__
    Boolean to determine if the modal is visible in the DOM.
9. __onEscapeKey__
    Function to invoke when the escape key is pressed.
10. __onClickBackground__
    Function to invoke when the modal's background is clicked.
11. __containerClassName__
    A custom classname to use for the modal element.
12. __layerPosition__
    The position that the modal should use.
13. __defaultIndex__
    The default z-index to use for the modals.
14. __mainElementSelector__
    The selector to use to find the DOM element to modify when the modal is
    rendered.
15. __mountPointSelector__
    The selector to use to find the element to mount the modal within.

### Example

```javascript
import { SimpleModal } from "@alexseitsinger/react-simple-modal"

function App(props) {
  return (
    <SimpleModal
      isVisible={true}
      closeButtonPosition={"window"}
      onClose={props.doClose}
      onClickBackground={props.doClose}
      onEscapeKey={props.doClose}>
      <div>An example modal body</div>
    </SimpleModal>
  )
}
```
