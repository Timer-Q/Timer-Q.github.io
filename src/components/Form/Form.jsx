import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"

import { Provider } from "./context"

import "./style/index.scss"

export default class Form extends Component {
  constructor(props) {
    super(props)
    this.state = {
      formItem: []
    }
  }

  static propTypes = {
    model: PropTypes.object,
    children: PropTypes.any,
    labelPosition: PropTypes.oneOf(["top", "left", "right"]),
    onSubmit: PropTypes.func,
    header: PropTypes.string,
    subHeader: PropTypes.string,
    rules: PropTypes.object,
    id: PropTypes.string,
    layout: PropTypes.oneOf(["horizontal", "vertical", "inline"])
  }

  static defaultProps = {
    layout: "vertical"
  }

  handleSubmit(e) {
    e.preventDefault()
    const { onSubmit } = this.props
    onSubmit && onSubmit()
  }

  /**
   * 缓存 form-items
   * @param {*} item 子item
   */
  getFormItem(item) {
    // 用 push 避免使用 setState 造成的页面刷新
    this.state.formItem.push(item)
  }

  /**
   * 移除指定 form-item
   * @param {*} item
   */
  remvoeFormItem(item) {
    if (item.props.prop) {
      this.state.formItem.splice(this.state.formItem.indexOf(item), 1)
    }
  }
  // 校验所有 FormItem
  validate(cb) {
    // 校验状态 是否校验成功
    let valid = true
    // 当前校验的是第几个 作用：当校验到最后一个的时候 执行 cb
    let validatedCount = 0

    const { formItem } = this.state
    // 如果 Form 下没有 FormItem 直接执行cb
    if (formItem.length === 0 && cb) {
      cb(true)
    }
    return new Promise(resolve => {
      formItem.forEach(item => {
        // trigger 传空，校验所有规则
        item.validate("", errors => {
          if (errors) {
            valid = false
          }
          if (++validatedCount === formItem.length) {
            if (cb instanceof Function) {
              cb(valid)
            }
            resolve(valid)
          }
        })
      })
    })
  }

  renderTitle() {
    const { header, subHeader } = this.props

    const title = header ? (
      <div className="form-header-wrapper">
        <h2 className="form-header">{header}</h2>
        {subHeader ? <h3 className="form-sub-header">{subHeader}</h3> : null}
      </div>
    ) : null

    return title
  }

  render() {
    const { labelPosition, id, header, layout } = this.props
    const classes = classNames("form", {
      [`form-label-${labelPosition}`]: labelPosition,
      [`form-${layout}`]: layout
    })
    return (
      <form
        id={id || header}
        onSubmit={this.handleSubmit.bind(this)}
        className={classes}>
        {this.renderTitle()}
        <Provider
          value={{
            formRules: this.props.rules,
            formModel: this.props.model,
            getFormItem: this.getFormItem.bind(this),
            remvoeFormItem: this.remvoeFormItem.bind(this)
          }}>
          {this.props.children}
        </Provider>
      </form>
    )
  }
}
