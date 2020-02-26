/// <reference types="underscore" />
import { CSSObject } from "@emotion/core";
declare type FunctionType = () => void;
interface CreateCheckerArgs {
    delay: number;
    check: () => boolean;
    pass: () => void;
    fail?: () => void;
    modalName: string;
}
export declare const createChecker: ({ delay, check, pass, fail, modalName, }: CreateCheckerArgs) => FunctionType;
interface CreateCancellableArgs {
    modalName: string;
    delay: number;
    handler: () => void;
}
export declare const createCancellable: ({ modalName, delay, handler, }: CreateCancellableArgs) => FunctionType[];
export declare function isNullish(o?: any): boolean;
export declare function isDefined(o?: any): boolean;
export declare const isDOM: boolean;
export declare function getTopOffset(el: HTMLElement): number;
export declare function getYOffset(): number;
export declare const defaultFixedStyle: CSSObject;
export declare function isFixed(el?: HTMLElement): boolean;
export declare function isAbsolute(el: HTMLElement): boolean;
export declare function getFixedStyle(el: HTMLElement): CSSObject;
export declare function addStyle(element: HTMLElement, style: CSSObject): void;
export declare function removeStyle(element: HTMLElement, style: CSSObject): void;
export declare function getElements(selector: string): HTMLElement[];
export declare function getElement(selector: string): HTMLElement | null;
export declare function isEscapeKey(keyCode: string | number): boolean;
export interface EventsType {
    [key: string]: ((e: Event) => void)[];
}
export declare function addEvent(eventName: string, callback: (e: Event) => void): void;
export declare function removeEvent(eventName: string, callback: (e: Event) => void): void;
export declare function scrollWindow(position: number): void;
export declare const getMountPoint: (mountPointSelector: string) => Element;
export declare const enableScrollingOnMainElement: (mainEl: HTMLElement) => void;
export declare const disableScrollingOnMainElement: (mainEl: HTMLElement) => void;
export declare const getInstances: (containerClassName: string) => [] | HTMLElement[];
export declare const disableScrollingOnOtherInstances: (containerClassName: string, exclude?: HTMLElement) => void;
export declare const enableScrollingOnOtherInstances: (containerClassName: string, exclude?: HTMLElement) => void;
export declare const getLayerIndex: (layerPosition: string, defaultIndex: number, containerClassName: string) => number;
export declare const handleKeyDownEvent: ((keyCode: number, f: FunctionType) => void) & import("underscore").Cancelable;
export declare const getShadeColor: (shade: string) => string;
export {};
