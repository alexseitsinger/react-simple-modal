# SimpleModal

A simple modal

## Installation

```bash
yarn add @alexseitsinger/react-simple-modal
```

## Props

Name                 | Description                                             | Default       | Required
---                  | ---                                                     | ---           | ---
isVisible            | Is the modal visible?                                   | true          | true
onClose              | Invoked whenever isVisible changes to false.            | undefined     | true
onOpen               | Invoked whenever isVisible changes to true.             | undefined     | false
backgroundShade      | The background color to use for the modal's background. | "dark"        | false
isCloseButtonVisible | Show the close button                                   | false         | false
closeButtonStyle     | Additional css to apply to the close button             | undefined     | false
closeButtonBody      | The node to render for the close button                 | undefined     | false
onEscapeKey          | Invoked whenever the escape key is pressed.             | undefined     | false
onClickBackground    | Invoked whenever the background is clicked.             | undefined     | false
containerClassName   | Custom classname to use for the modal.                  | "SimpleModal" | false
layerPosition        | Should the modal be above or below the main element?    | "above"       | false
defaultIndex         | The default z-index to use for the modal                | 200           | false
mountPointSelector   | The selector to use to mount the modal under.           | document.body | false

## Example

```javascript
// Within App root
//
// NOTE:
// 'SimpleModalProvider' must wrap your apps top-most DOM element because it
// changes this elements style from 'fixed' to 'static' as each modal is made
// visible.
//
import { SimpleModalProvider } from "@alexseitsinger/react-simple-modal"

function App({ store, history }) {
  return (
	  <Provider store={store}>
		  <ConnectedRouter history={history}>
			  <SimpleModalProvider>
					<div id={"app"}>
						<Route patch={"/"} exact component={HomePage} />
					</div>
				</SimpleModalProvider>
			</ConnectedRouter>
		</Provider>
	)
}
```

```javascript
// Within app page
import { SimpleModal } from "@alexseitsinger/react-simple-modal"

function HomePage({ handleCloseModal, isModalVisible }) {
  return (
    <SimpleModal
      isVisible={isModalVisible}
			onClose={handleCloseModal}>
			<div>Some modal content.</div>
    </SimpleModal>
  )
}
```
