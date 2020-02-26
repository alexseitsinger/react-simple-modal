import React, { PureComponent, ReactElement, ReactNode } from "react";
import { CSSObject } from "@emotion/core";
interface Props {
    children: ReactNode | ReactNode[];
}
interface State {
    modalName: string;
    style: CSSObject;
}
export declare class SimpleModalProvider extends PureComponent<Props, State> {
    state: State;
    mainRef: React.RefObject<HTMLDivElement>;
    portalRef: React.RefObject<HTMLDivElement>;
    handleUnmount: (currentModalName: string) => void;
    handleMount: (modalName: string) => void;
    handleRender: (el: React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>) => React.ReactElement<any, string | ((props: any) => React.ReactElement<any, string | any | (new (props: any) => React.Component<any, any, any>)>) | (new (props: any) => React.Component<any, any, any>)>;
    getContainerStyle: (modalName: string) => CSSObject;
    render(): ReactElement;
}
export {};
