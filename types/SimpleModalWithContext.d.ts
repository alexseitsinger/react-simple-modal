import React, { ReactElement, ReactNode } from "react";
import { CSSObject } from "@emotion/core";
declare const defaultProps: {
    containerClassName: string;
    containerLayer: number;
    backgroundShade: string;
    closeButtonClassName: string;
    closeButtonPosition: string;
    isCloseButtonVisible: boolean;
};
declare type DefaultProps = Readonly<typeof defaultProps>;
declare type BackgroundShades = "dark" | "darker" | "darkest" | "light" | "lighter" | "lightest";
declare type CloseButtonPositions = "foreground" | "window";
export declare type SimpleModalWithContextProps = {
    modalName: string;
    containerClassName?: string;
    containerLayer?: number;
    backgroundShade?: BackgroundShades;
    onClickBackground?: () => void;
    isCloseButtonVisible?: boolean;
    closeButtonClassName?: string;
    closeButtonStyle?: CSSObject;
    closeButtonPosition?: CloseButtonPositions;
    onClickCloseButton?: () => void;
    renderCloseButton?: () => ReactElement;
    onEscapeKey?: () => void;
    children?: ReactNode | ReactNode[];
} & Partial<DefaultProps>;
export declare const SimpleModalWithContext: {
    (props: SimpleModalWithContextProps): React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>;
    defaultProps: {
        containerClassName: string;
        containerLayer: number;
        backgroundShade: string;
        closeButtonClassName: string;
        closeButtonPosition: string;
        isCloseButtonVisible: boolean;
    };
};
export {};
