import React, { Component, ReactElement, ReactNode } from "react"
import FocusLock from "react-focus-lock"

import {
  SimpleModalBackground,
  SimpleModalButton,
  SimpleModalContainer,
  SimpleModalContent,
  SimpleModalForeground,
} from "./elements"
import { ContextProps } from "./SimpleModalContext"
import { SimpleModalWithContextProps } from "./SimpleModalWithContext"
import { addEvent, handleKeyDownEvent, removeEvent } from "./utils/general"

export type SimpleModalProps = SimpleModalWithContextProps & ContextProps

export class SimpleModal extends Component<SimpleModalProps> {
  componentDidMount(): void {
    const { modalName, handleMount } = this.props

    handleMount(modalName)

    addEvent("keydown", this.handleKeyDown)
  }

  componentWillUnmount(): void {
    const { modalName, handleUnmount } = this.props

    handleUnmount(modalName)

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
      <SimpleModalButton
        type={"button"}
        className={closeButtonClassName}
        css={closeButtonStyle}
        onClick={onClickCloseButton}>
        {renderCloseButton()}
      </SimpleModalButton>
    ) : null

    return (
      <FocusLock>
        <SimpleModalContainer
          className={containerClassName}
          containerLayer={containerLayer}>
          <SimpleModalBackground
            onClick={onClickBackground}
            backgroundShade={backgroundShade}
          />
          <SimpleModalForeground>
            {closeButtonPosition === "foreground" ? renderedCloseButton : null}
            <SimpleModalContent>
              {closeButtonPosition === "window" ? renderedCloseButton : null}
              {children}
            </SimpleModalContent>
          </SimpleModalForeground>
        </SimpleModalContainer>
      </FocusLock>
    )
  }

  render(): ReactNode {
    const { handleRender } = this.props
    return handleRender(this.renderModal())
  }
}
