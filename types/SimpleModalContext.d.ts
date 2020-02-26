import React, { ReactElement, ReactNode } from "react";
export interface ContextProps {
    handleRender: (e: ReactElement) => ReactNode;
    handleUnmount: (n: string) => void;
    handleMount: (n: string) => void;
}
export declare const Context: React.Context<{}>;
