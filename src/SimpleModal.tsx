import React, { ReactElement } from "react"
import FocusLock from "react-focus-lock"

import {
  Background,
  Button,
  Container,
  Content,
  Foreground,
} from "src/elements"
import { addMounted, hasBeenMounted, removeMounted } from "src/mounted"
import { ContextProps } from "src/SimpleModalContext"
import { SimpleModalWithContextProps } from "src/SimpleModalWithContext"

import {
  addEvent,
  createChecker,
  handleKeyDownEvent,
  removeEvent,
} from "./utils"

type Props = SimpleModalWithContextProps & ContextProps

export class SimpleModal extends React.Component<Props> {
  check: () => void

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

  handleKeyDown = (e: KeyboardEvent): void => {
    const { onEscapeKey } = this.props

    handleKeyDownEvent(e.which, onEscapeKey)
  }

  renderModal = (): ReactElement => {
    const {
      children,

      containerClassName,
      containerLayer,

      backgroundShade,
      onClickBackground,

      isCloseButtonVisible,
      closeButtonClassName,
      closeButtonPosition,
      closeButtonStyle,
      onClickCloseButton,
      renderCloseButton,
    } = this.props

    const renderedCloseButton = isCloseButtonVisible ? (
      <Button
        type={"button"}
        className={closeButtonClassName}
        css={closeButtonStyle}
        onClick={onClickCloseButton}>
        {renderCloseButton()}
      </Button>
    ) : null

    return (
      <FocusLock>
        <Container
          className={containerClassName}
          containerLayer={containerLayer}>
          <Background
            onClick={onClickBackground}
            backgroundShade={backgroundShade}
          />
          <Foreground>
            {closeButtonPosition === "foreground" ? renderedCloseButton : null}
            <Content>
              {closeButtonPosition === "window" ? renderedCloseButton : null}
              {children}
            </Content>
          </Foreground>
        </Container>
      </FocusLock>
    )
  }

  render(): ReactElement {
    return null
  }
}
