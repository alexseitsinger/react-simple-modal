import React, { ReactElement } from "react"

export interface ContextProps {
  renderModal: (name: string, element: ReactElement) => void;
  removeModal: (name: string) => void;
  shouldRender: boolean;
}

const defaultContext: ContextProps = {
  shouldRender: true,
  renderModal: () => {
    console.log("renderModal() not implemented.")
  },
  removeModal: () => {
    console.log("removeModal() not implemented.")
  },
}

export const Context = React.createContext(defaultContext)
