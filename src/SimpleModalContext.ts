import React from "react"

export interface ContextProps {
  setFixed?: () => void;
  setFree?: () => void;
  isFixed: boolean;
}

const defaultContext: ContextProps = {
  setFixed: undefined,
  setFree: undefined,
  isFixed: false,
}

export const Context = React.createContext(defaultContext)
