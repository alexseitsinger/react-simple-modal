import React, { ReactElement } from "react"

export interface ContextProps {
  renderModal: (n: string, el: ReactElement) => void;
  removeModal: (n: string) => void;
}

const defaultContext: ContextProps = {
  renderModal: () => {
    console.log("renderModal() not implemented.")
  },
  removeModal: () => {
    console.log("removeModal() not implemented.")
  },
}

export const Context = React.createContext(defaultContext)
