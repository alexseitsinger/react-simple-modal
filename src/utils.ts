import { CSSObject } from "@emotion/core"
// @ts-ignore
import computedStyle from "computed-style"

export const documentExists = typeof document !== "undefined"

const windowExists = typeof window !== "undefined"

export function getTopOffset(el: HTMLElement) {
  const topPos = computedStyle(el, "top")
  if (topPos === "auto") {
    return 0
  }
  return Math.abs(Number.parseInt(topPos))
}

export function getYOffset() {
  if (windowExists === false) {
    return 0
  }
  return Math.abs(window.pageYOffset)
}

export const defaultFixedStyle: CSSObject = {
  position: "fixed",
  width: "100%",
  maxWidth: "auto",
}

export function getFixedStyle(el: HTMLElement) {
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

function getMaxWidth(el: HTMLElement) {
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

function toCamelCase(string: string) {
  return string.replace(
    /(\w)(\w*)/g,
    (g0, g1, g2) => g1.toUpperCase() + g2.toLowerCase()
  )
}

function toHyphenCase(string: string) {
  return string.replace(/([a-z])([A-Z])/g, "$1-$2").toLowerCase()
}

function getSiblings(el: HTMLElement) {
  let sibs: ChildNode[] = []
  let currentEl
  if (el && el.parentNode && el.parentNode.firstChild) {
    currentEl = el.parentNode.firstChild
    do {
      if (currentEl && currentEl.nodeType === 3) {
        continue
      }
      if (currentEl !== el) {
        sibs = [...sibs, currentEl]
      }
    } while ((currentEl = currentEl.nextSibling))
  }
  return sibs
}

export function isFixed(el: HTMLElement) {
  const position = computedStyle(el, "position")
  return position === "fixed"
}

export function isAbsolute(el: HTMLElement) {
  const position = computedStyle(el, "position")
  return position === "absolute"
}

export function addStyle(element: HTMLElement, style: CSSObject) {
  const keys = Object.keys(style)
  keys.forEach((key: string) => {
    // @ts-ignore
    element.style[key] = style[key]
  })
}

export function removeStyle(element: HTMLElement, style: CSSObject) {
  Object.keys(style).forEach(key => {
    const keyName = toHyphenCase(key)
    element.style.removeProperty(keyName)
  })
}

export function getElements(selector: string): HTMLElement[] | [] {
  if (documentExists === false) {
    return []
  }
  return Array.from(document.querySelectorAll(selector))
}

export function getElement(selector: string): HTMLElement | null {
  if (documentExists === false) {
    return null
  }
  return document.querySelector(selector)
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
  if (e.type) {
    const type = e.type.toLowerCase()
    events[type].forEach((f: (e: Event) => void) => f(e))
  }
}

export function addEvent(
  eventName: string,
  callback: (e: Event) => void
): void {
  if (documentExists === false) {
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
  if (documentExists === false) {
    return
  }

  const eventType = eventName.toLowerCase()
  const fns = events[eventType]
  const i = fns.indexOf(callback)

  fns.splice(i, 1)

  if (!fns.length) {
    document.removeEventListener(eventType, eventHandler, false)
  }
}

export function scrollWindow(position: number): void {
  if (windowExists === false) {
    return
  }

  window.scrollTo(0, position)
}
