import React, { ReactElement, ReactNode } from "react"
import FocusLock from "react-focus-lock"
import { CSSObject } from "@emotion/core"

import { Background, Button, Container, Content, Foreground } from "./elements"
import { getLayerIndex, isDefined } from "./utils"

interface Props {
  children: ReactNode | ReactNode[];
  backgroundShade: string;
  onClickBackground?: () => void;
  closeButtonPosition: string;
  layerPosition: string;
  defaultIndex: number;
  containerClassName: string;
  isCloseButtonVisible: boolean;
  closeButtonStyle?: CSSObject;
  onClickCloseButton?: () => void;
  closeButtonBody?: ReactNode;
  onDidMount: (el: HTMLDivElement) => void;
  onWillUnmount: (el: HTMLDivElement) => void;
}

export class SimpleModalInner extends React.Component<Props> {
  elementRef = React.createRef<HTMLDivElement>()

  componentDidMount(): void {
    const { onDidMount } = this.props
    const { current } = this.elementRef

    if (isDefined(onDidMount) && isDefined(current)) {
      onDidMount(current)
    }
  }

  componentWillUnmount(): void {
    const { onWillUnmount } = this.props
    const { current } = this.elementRef

    if (isDefined(onWillUnmount) && isDefined(current)) {
      onWillUnmount(current)
    }
  }

  render(): ReactElement {
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
    } = this.props

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

    const zIndex = getLayerIndex(
      layerPosition,
      defaultIndex,
      containerClassName
    )

    return (
      <FocusLock>
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
      </FocusLock>
    )
  }
}
