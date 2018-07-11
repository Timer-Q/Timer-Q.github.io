import React from "react"
import PropTypes from "prop-types"

import MixinComponent from "./MixinComponent"

export default class MenuItemGroup extends MixinComponent{
  static propTypes = {
    title: PropTypes.string.isRequired
  }
  
  render() {
    return <div>item group</div>
  }
}