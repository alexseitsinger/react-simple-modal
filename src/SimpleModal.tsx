import React, { ReactElement } from "react"
import ReactFocusLock from "react-focus-lock"
//import stylePropType from "react-style-proptype"
//import PropTypes from "prop-types"
import { debounce } from "underscore"

import { addMounted,hasBeenMounted, removeMounted } from "src/mounted"
import { ContextProps } from "src/SimpleModalContext"
import { SimpleModalWithContextProps } from "src/SimpleModalWithContext"

import { Background, Button, Container, Content, Foreground } from "./elements"
import {   addEvent,
  addStyle,
  //createCancellable,
  //createCancellableMethod,
  createChecker,
  //disableScrollingOnMainElement,
  //disableScrollingOnOtherInstances,
  //enableScrollingOnMainElement,
  //enableScrollingOnOtherInstances,
  getLayerIndex,
  //getMountPoint,
  //getTopOffset,
  //getYOffset,
  isDefined,
  //isDOM,
  isEscapeKey,
  //isNullish,
  removeEvent,
} from "./utils"

type Props = SimpleModalWithContextProps & ContextProps

export class SimpleModal extends React.Component<Props> {
  elementRef = React.createRef<HTMLDivElement>()

  // When the document has a keydown event, debounce the event until the last
  // one. Then, check if it's the ESC key. If it is, check if we got a prop
  // called onEscapeKey, and invoke it if so.
  handleKeyDown = debounce((e: KeyboardEvent): void => {
    const { isVisible, onEscapeKey } = this.props

    if (isEscapeKey(e.which)) {
      if (isVisible) {
        if (onEscapeKey !== undefined) {
          onEscapeKey()
        }
      }
    }
  }, 250)

  check: (() => void) | undefined

  constructor(props: Props) {
    super(props)

    const { modalName, removeModal } = props

    this.check = createChecker({
      modalName,
      delay: 600,
      check: (): boolean => {
        return !hasBeenMounted(modalName)
      },
      complete: () => {
        removeModal(modalName)
      },
    })
  }

  componentDidMount(): void {
    const { renderModal, modalName } = this.props

    addMounted(modalName)

    renderModal(modalName, this.renderModal())

    addEvent("keydown", this.handleKeyDown)
  }

  componentWillUnmount(): void {
    const { modalName } = this.props

    removeMounted(modalName)

    this.check()

    removeEvent("keydown", this.handleKeyDown)
  }

  renderModal = (): ReactElement => {
    const {
      children,
      backgroundShade,
      onClickBackground,
      closeButtonPosition,
      layerPosition,
      defaultIndex,
      containerClassName,
      isCloseButtonVisible,
      closeButtonStyle,
      onClickCloseButton,
      closeButtonBody,
      onOpen,
    } = this.props

    const { current } = this.elementRef
    if (isDefined(current)) {
      const zIndex = getLayerIndex(
        layerPosition,
        defaultIndex,
        containerClassName
      )
      addStyle(current, { zIndex })
    }

    if (onOpen !== undefined) {
      onOpen()
    }

    const renderedCloseButton = isCloseButtonVisible ? (
      <Button
        css={closeButtonStyle}
        position={closeButtonPosition}
        shade={backgroundShade}
        onClick={onClickCloseButton}>
        {closeButtonBody}
      </Button>
    ) : null

    const renderedForegroundCloseButton =
      closeButtonPosition === "foreground" ? renderedCloseButton : null

    const renderedWindowCloseButton =
      closeButtonPosition === "window" ? renderedCloseButton : null

    const zIndex = getLayerIndex(layerPosition, defaultIndex, containerClassName)

    return (
      <ReactFocusLock>
        <Container
          ref={this.elementRef}
          className={containerClassName}
          zIndex={zIndex}>
          <Background
            backgroundShade={backgroundShade}
            onClick={onClickBackground}
          />
          <Foreground>
            {renderedForegroundCloseButton}
            <Content>
              {renderedWindowCloseButton}
              {children}
            </Content>
          </Foreground>
        </Container>
      </ReactFocusLock>
    )
  }

  render(): ReactElement {
    return null
  }
}
