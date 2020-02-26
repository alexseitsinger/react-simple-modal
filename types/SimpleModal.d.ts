import React, { Component, ReactNode } from "react";
import { ContextProps } from "./SimpleModalContext";
import { SimpleModalWithContextProps } from "./SimpleModalWithContext";
export declare type SimpleModalProps = SimpleModalWithContextProps & ContextProps;
export declare class SimpleModal extends Component<SimpleModalProps> {
    componentDidMount(): void;
    componentWillUnmount(): void;
    handleKeyDown: (e: KeyboardEvent) => void;
    renderModal: () => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>;
    render(): ReactNode;
}
