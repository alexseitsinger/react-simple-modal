import React, { ReactNode } from "react"
import { CSSObject } from "@emotion/core"

export interface SimpleModalProps {
  children: ReactNode | ReactNode[];
  backgroundShade?: string;
  isCloseButtonVisible?: boolean;
  closeButtonStyle?: CSSObject;
  closeButtonPosition?: string;
  closeButtonBody?: ReactNode | ReactNode[];
  onClose: () => void;
  onOpen?: () => void;
  isVisible?: boolean;
  onEscapeKey?: () => void;
  onClickBackground?: () => void;
  containerClassName?: string;
  layerPosition?: string;
  defaultIndex?: number;
  mainElementSelector?: string;
  mountPointSelector?: string;
  onClickCloseButton?: () => void;
}

export class SimpleModal extends React.Component<SimpleModalProps> {}
