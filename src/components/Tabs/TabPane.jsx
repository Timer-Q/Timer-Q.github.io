import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
export default class TabPane extends Component {
  static propTypes = {
    actived: PropTypes.bool,
    children: PropTypes.any,
    destroyInactiveTabPane: PropTypes.bool,
    paneClosable: PropTypes.bool
  }

  render() {
    const { children, actived, destroyInactiveTabPane } = this.props
    const classes = classNames("tabs-pane", {
      "is-actived": actived,
      "is-inactived": !actived
    })
    return (
      <div className={classes}>
        {actived || !destroyInactiveTabPane ? children : null}
      </div>
    )
  }
}
