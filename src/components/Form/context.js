import React, { Component } from "react"
import PropTypes from "prop-types"
import FormItem from "./FormItem"

export const { Provider, Consumer } = React.createContext()

// export function FormItemWithConsumer(props) {
//   return (
//     <Consumer>
//       {context => {
//         return <FormItem {...props} {...context} />
//       }}
//     </Consumer>
//   )
// }

export class FormItemWithConsumer extends Component {
  static propTypes = {
    formItemRef: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.ref = React.createRef()
  }

  componentDidMount() {
    const { formItemRef } = this.props
    formItemRef && formItemRef(this.ref)
  }

  render() {
    return (
      <Consumer>
        {context => {
          return <FormItem {...this.props} {...context} ref={this.ref} />
        }}
      </Consumer>
    )
  }
}
