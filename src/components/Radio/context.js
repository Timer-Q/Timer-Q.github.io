import React, { createContext } from "react"
import Radio from "./Radio"

export const { Provider, Consumer } = createContext()

export const RadioWithConsumer = props => {
  return (
    <Consumer>
      {context => {
        return <Radio {...props} {...context} />
      }}
    </Consumer>
  )
}
