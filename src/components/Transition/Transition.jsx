import React, { Component } from "react"
import PropTypes from "prop-types"
import { CSSTransition } from "react-transition-group"

export default class Transition extends Component {
  static propTypes = {
    children: PropTypes.any,
    transitionName: PropTypes.string,
    in: PropTypes.bool,
    style: PropTypes.object,
    onEnter: PropTypes.func,
    onExited: PropTypes.func
  }

  static defaultProps = {
    style: {},
    transitionName: "dropdown"
  }

  constructor(props) {
    super(props)
    this.state = {
      isWillShow: false,
      isShow: props.in
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (nextProps.in === prevState.isWillShow) return null
    return {
      isWillShow: nextProps.in
    }
  }

  handleEnter() {
    this.setState({ isShow: true })

    const { onEnter } = this.props
    if (onEnter) onEnter()
  }

  handleExited() {
    this.setState({ isShow: false })

    const { onExited } = this.props
    if (onExited) onExited()
  }

  render() {
    const { children, style, transitionName, ...rest } = this.props
    const { isWillShow, isShow } = this.state
    const styles =
      isWillShow || isShow
        ? style
        : Object.assign({}, style, { display: "none" })
    return (
      <CSSTransition
        {...rest}
        classNames={transitionName}
        style={styles}
        appear={true}
        timeout={{ enter: 200, exit: 200 }}
        onEnter={this.handleEnter.bind(this)}
        onExited={this.handleExited.bind(this)}>
        {children}
      </CSSTransition>
    )
  }
}
