import React, { ReactElement } from "react"
import FocusLock from "react-focus-lock"
import { isEqual } from "underscore"

//import { debounce, isEqual } from "underscore"
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
  handleUnmount: () => void

  constructor(props: Props) {
    super(props)

    const { modalName, removeModal } = props

    this.handleUnmount = createChecker({
      modalName,
      delay: 600,
      check: (): boolean => {
        return !hasBeenMounted(modalName)
      },
      fail: () => {
        console.log("modal was re-mounted")
      },
      pass: () => {
        removeModal(modalName)
      },
    })
  }

  componentDidMount(): void {
    const { renderModal, modalName, shouldRender } = this.props

    addMounted(modalName)

    /**
     * To prevent an infinte loop, our provider passes down a boolean prop that
     * changes to false whenever we run its renderModal() method.
     */
    if (shouldRender) {
      renderModal(modalName, this.renderModal())
    }

    addEvent("keydown", this.handleKeyDown)
  }

  componentDidUpdate(prevProps: Props): void {
    /**
     * To prevent an infinite loop, we need to check to make sure the props have
     * changed before calling our provided renderModal() method.
     */
    if (isEqual(prevProps, this.props)) {
      return
    }
    /**
     * If the props have changed, go ahead and render a new element in the
     * provider.
     */
    const { modalName, renderModal } = this.props
    renderModal(modalName, this.renderModal())
  }

  componentWillUnmount(): void {
    const { modalName } = this.props

    removeMounted(modalName)

    this.handleUnmount()

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
