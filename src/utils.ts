import { CSSObject } from "@emotion/core"
// @ts-ignore
import computedStyle from "computed-style"
import { debounce, uniq } from "underscore"

type FunctionType = () => void

interface CreateCheckerArgs {
  delay: number;
  check: () => boolean;
  complete: () => void;
  modalName: string;
}

interface CheckerMethodCache {
  [key: string]: FunctionType;
}

const checkerMethodCache: CheckerMethodCache = {}

export const createChecker = ({
  delay,
  check,
  complete,
  modalName,
}: CreateCheckerArgs): FunctionType => {
  const create = (): FunctionType => {
    return debounce(() => {
      if (check() === true) {
        complete()
      }
    }, delay)
  }

  if (!(modalName in checkerMethodCache)) {
    checkerMethodCache[modalName] = create()
  }

  return checkerMethodCache[modalName]
}

interface CreateCancellableArgs {
  modalName: string;
  delay: number;
  handler: () => void;
}

interface CancellableMethodCache {
  [key: string]: FunctionType[];
}

const cancellableMethodCache: CancellableMethodCache = {}

export const createCancellable = ({
  modalName,
  delay,
  handler,
}: CreateCancellableArgs): FunctionType[] => {
  const create = (): FunctionType[] => {
    let isCancelled = false

    const method = debounce((): void => {
      if (isCancelled === true) {
        return
      }

      handler()
    }, delay)

    const cancel = (): void => {
      isCancelled = true
    }

    const reset = (): void => {
      isCancelled = false
    }

    return [method, cancel, reset]
  }

  if (!(modalName in cancellableMethodCache)) {
    cancellableMethodCache[modalName] = create()
  }

  return cancellableMethodCache[modalName]
}

export function isNullish(o?: any): boolean {
  return o === null || typeof o === "undefined"
}

export function isDefined(o?: any): boolean {
  return isNullish(o) === false
}

export const isDOM = typeof document !== "undefined"

const hasWindow = typeof window !== "undefined"

export function getTopOffset(el: HTMLElement): number {
  const topPos = computedStyle(el, "top")
  if (topPos === "auto") {
    return 0
  }
  return Math.abs(Number.parseInt(topPos))
}

export function getYOffset(): number {
  if (hasWindow) {
    return Math.abs(window.pageYOffset)
  }
  return 0
}

export const defaultFixedStyle: CSSObject = {
  position: "fixed",
  width: "100%",
  maxWidth: "auto",
}

function getSiblings(el: HTMLElement): ChildNode[] {
  let sibs: ChildNode[] = []
  let currentEl: ChildNode = el.parentNode.firstChild

  do {
    if (isDefined(currentEl) && currentEl.nodeType === 3) {
      continue
    }
    if (currentEl !== el) {
      sibs = [...sibs, currentEl]
    }
  } while (isDefined((currentEl = currentEl.nextSibling)))

  return sibs
}

export function isFixed(el?: HTMLElement): boolean {
  if (isDefined(el)) {
    const position = computedStyle(el, "position")
    return position === "fixed"
  }
  return false
}

export function isAbsolute(el: HTMLElement): boolean {
  if (isDefined(el)) {
    const position = computedStyle(el, "position")
    return position === "absolute"
  }
  return false
}

function getMaxWidth(el: HTMLElement): number {
  const parentCs = computedStyle(el.parentNode, "width")
  var maxWidth = parseInt(parentCs.width)
  getSiblings(el).forEach((sib: HTMLElement) => {
    if (isFixed(sib) || isAbsolute(sib)) {
      const sibCs = computedStyle(sib, "width")
      maxWidth -= parseInt(sibCs.width)
    }
  })
  return maxWidth
}

export function getFixedStyle(el: HTMLElement): CSSObject {
  var style = defaultFixedStyle
  const maxWidth = getMaxWidth(el)
  if (maxWidth > 0) {
    style = {
      ...style,
      maxWidth: `${maxWidth}px`,
    }
  }
  return style
}

function toCamelCase(string: string): string {
  return string.replace(
    /(\w)(\w*)/g,
    (g0, g1, g2) => `${g1.toUpperCase()}${g2.toLowerCase()}`
  )
}

function toHyphenCase(string: string): string {
  return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

export function addStyle(element: HTMLElement, style: CSSObject): void {
  Object.keys(style).forEach((key: string) => {
    const hyphen = toHyphenCase(key)
    const value: string = style[key].toString()
    element.style.setProperty(hyphen, value)
  })
}

export function removeStyle(element: HTMLElement, style: CSSObject): void {
  Object.keys(style).forEach(key => {
    element.style.removeProperty(toHyphenCase(key))
  })
}

export function getElements(selector: string): HTMLElement[] {
  if (isDOM) {
    return Array.from(document.querySelectorAll(selector))
  }
  return []
}

export function getElement(selector: string): HTMLElement | null {
  if (isDOM) {
    return document.querySelector(selector)
  }
  return null
}

export function isEscapeKey(keyCode: string | number): boolean {
  const escapeKeyCode = 27
  if (keyCode === escapeKeyCode) {
    return true
  }
  return false
}

export interface EventsType {
  [key: string]: ((e: Event) => void)[];
}

const events: EventsType = {}
const eventHandler = (e: Event): void => {
  if (isDefined(e.type)) {
    const type = e.type.toLowerCase()
    events[type].forEach((f: (e: Event) => void) => f(e))
  }
}

export function addEvent(
  eventName: string,
  callback: (e: Event) => void
): void {
  if (isDOM === false) {
    return
  }
  const type = eventName.toLowerCase()
  if (!(type in events)) {
    events[type] = []
    document.addEventListener(type, eventHandler, false)
  }
  events[type] = [...events[type], callback]
}

export function removeEvent(
  eventName: string,
  callback: (e: Event) => void
): void {
  if (isDOM === false) {
    return
  }

  const eventType = eventName.toLowerCase()
  const fns = events[eventType]
  const i = fns.indexOf(callback)

  fns.splice(i, 1)

  if (fns.length === 0) {
    document.removeEventListener(eventType, eventHandler, false)
  }
}

export function scrollWindow(position: number): void {
  if (isDOM && hasWindow && isDefined(window.scrollTo)) {
    window.scrollTo(0, position)
  }
}

export const getMountPoint = (mountPointSelector: string): Element | null => {
  if (isDOM) {
    if (isDefined(mountPointSelector)) {
      const mountPoint = getElement(mountPointSelector)
      if (isDefined(mountPoint)) {
        return mountPoint
      }
    }
    /**
     * If we return document.body by default, then server-side rendering will
     * fail to return anything as output. Therefore, avoid doing so.
     */
    //return document.body
  }
  return null
}

export const enableScrollingOnMainElement = (mainEl: HTMLElement): void => {
  if (isDefined(mainEl) && isFixed(mainEl)) {
    // Record the current top position of the main element.
    // NOTE: Must be before everything else to capture the top position offset.)
    const topPos = getTopOffset(mainEl)
    // Remove the styles for the fixed els.
    removeStyle(mainEl, getFixedStyle(mainEl))
    // Apply the style for top position reset.
    addStyle(mainEl, {
      top: "0px",
    })
    // Force the window to re-scroll to the original position.
    // NOTE: Must be the last thing to run in order to reset scrolling.
    scrollWindow(topPos)
  }
}

export const disableScrollingOnMainElement = (mainEl: HTMLElement): void => {
  if (isDefined(mainEl) && isFixed(mainEl) === false) {
    // Record the window position before we fix the element.
    const yOffset = getYOffset()
    // Fix the main element to remove scrolling.
    addStyle(mainEl, getFixedStyle(mainEl))
    // Get the top position of the main element.
    const topPos = getTopOffset(mainEl)
    // If the top position is not greater than 0, apply a negative top offset to move it up when the modal is opened.
    if (!(topPos > 0)) {
      addStyle(mainEl, {
        top: `-${yOffset}px`,
      })
    }
  }
}

export const getInstances = (
  containerClassName: string
): HTMLElement[] | [] => {
  if (!isDOM) {
    return []
  }
  return uniq([
    ...getElements(".SimpleModal"),
    ...getElements(`.${containerClassName}`),
  ])
}

const getOtherInstances = (
  containerClassName: string,
  exclude?: HTMLElement
): HTMLElement[] => {
  const instances = getInstances(containerClassName)
  return instances.filter(inst => inst !== exclude)
}

export const disableScrollingOnOtherInstances = (
  containerClassName: string,
  exclude?: HTMLElement
): void =>
  getOtherInstances(containerClassName, exclude).forEach(inst => {
    // const el = ReactDOM.findDOMNode(inst)
    if (!isFixed(inst)) {
      addStyle(inst, defaultFixedStyle)
    }
  })

export const enableScrollingOnOtherInstances = (
  containerClassName: string,
  exclude?: HTMLElement
): void =>
  getOtherInstances(containerClassName, exclude).forEach(inst => {
    // const el = ReactDOM.findDOMNode(inst)
    if (isFixed(inst)) {
      removeStyle(inst, defaultFixedStyle)
    }
  })

export const getLayerIndex = (
  layerPosition: string,
  defaultIndex: number,
  containerClassName: string
): number => {
  const totalInstances = getInstances(containerClassName).length
  if (totalInstances === 0) {
    return defaultIndex
  }
  if (layerPosition === "above") {
    return defaultIndex + totalInstances
  }
  if (layerPosition === "below") {
    return defaultIndex - totalInstances
  }
  return defaultIndex
}

export const handleKeyDownEvent = debounce(
  (keyCode: number, f: FunctionType): void => {
    if (isEscapeKey(keyCode)) {
      if (isDefined(f)) {
        f()
      }
    }
  },
  250
)

const getShadeOpacity = (shade: string): number => {
  const defaultOpacity = 0.5
  switch (shade) {
    default:
    case "dark":
    case "light": {
      return defaultOpacity
    }
    case "darker":
    case "lighter": {
      return defaultOpacity + 0.2
    }
    case "darkest":
    case "lightest": {
      return defaultOpacity + 0.4
    }
  }
}

export const getShadeColor = (shade: string): string => {
  const opacity = getShadeOpacity(shade)
  switch (shade) {
    default:
    case "dark":
    case "darker":
    case "darkest": {
      return `rgba(22, 22, 22, ${opacity})`
    }
    case "light":
    case "lighter":
    case "lightest": {
      return `rgba(225, 225, 225, ${opacity})`
    }
  }
}
