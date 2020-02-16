# SimpleModal

A simple modal

## Installation

```bash
yarn add @alexseitsinger/react-simple-modal
```

## Props

Name                 | Description                                             | Default                   | Required
---                  | ---                                                     | ---                       | ---
modalName            | The unique name of the modal.                           | undefined                 | true
containerClassName   | Custom classname to use for the modal.                  | "SimpleModal"             | false
containerLayer       | The default z-index to use for the modal                | 200                       | false
backgroundShade      | The background color to use for the modal's background. | "dark"                    | false
onClickBackground    | Invoked when the background is clicked.                 | undefined                 | false
closeButtonClassName | The class name to use for the close button.             | "SimpleModal-CloseButton" | false
isCloseButtonVisible | Show the close button                                   | false                     | false
closeButtonStyle     | Additional css to apply to the close button             | undefined                 | false
renderCloseButton    | Invoked to render the button body                       | undefined                 | false
onEscapeKey          | Invoked whenever the escape key is pressed.             | undefined                 | false
children             | The content to render in the modal                      | undefined                 | false

## Example

```javascript
// Within App root
import { SimpleModalProvider } from "@alexseitsinger/react-simple-modal"

function App({ store, history }) {
  return (
    <Provider store={store}>
      <ConnectedRouter history={history}>
        <SimpleModalProvider>
          <Route patch={"/"} exact component={HomePage} />
        </SimpleModalProvider>
      </ConnectedRouter>
    </Provider>
  )
}
```

```javascript
// Within app page
import { SimpleModal } from "@alexseitsinger/react-simple-modal"

function HomePage() {
  return (
    <SimpleModal
      modalName={"home-page-modal"}>
      <div>Some modal content.</div>
    </SimpleModal>
  )
}
```
