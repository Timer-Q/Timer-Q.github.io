import React, { createContext } from "react"
import AnchorLink from "./AnchorLink"

export const { Provider, Consumer } = createContext()

export const AnchorLinkWithConsumer = props => {
  return (
    <Consumer>
      {context => {
        return <AnchorLink {...props} {...context} />
      }}
    </Consumer>
  )
}
