import React, { Component } from "react"
import PropTypes from "prop-types"
import AsyncValidator from "async-validator"
import classNames from "classnames"
import Transition from "../Transition"

// FIXME: validator 输入框无法获取 number 类型的值
// TODO: 完善表单结构（每一个item 下面会有显示的list）
// TODO: ......

export default class FormItem extends Component {
  constructor(props) {
    super(props)

    this.state = {
      error: "",
      valid: true,
      validating: false
    }
    this.required = false
    this.getRules()
  }

  static propTypes = {
    children: PropTypes.any,
    value: PropTypes.any,
    prop: PropTypes.string, // model 中的某一项的 key
    rules: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    formRules: PropTypes.oneOfType([PropTypes.object, PropTypes.array]),
    label: PropTypes.string,
    header: PropTypes.oneOfType([PropTypes.string, PropTypes.object]),
    formModel: PropTypes.object,
    getFormItem: PropTypes.func,
    remvoeFormItem: PropTypes.func,
    onClick: PropTypes.func,
    onFocus: PropTypes.func,
    onBlur: PropTypes.func,
    style: PropTypes.object,
    className: PropTypes.string
  }

  componentDidMount() {
    this.props.getFormItem(this)
  }

  componentWillUnmount() {
    this.props.remvoeFormItem(this)
  }

  handleBlur() {
    this.validate("blur")
    const { onBlur } = this.props
    onBlur && onBlur()
  }

  handleFocus = () => {
    const { onFocus } = this.props
    onFocus && onFocus()
  }

  handleClick = () => {
    const { onClick } = this.props
    onClick && onClick()
  }

  handleChange = () => {
    // NOTE: 由于数据绑定和校验的触发都是由 change 事件触发，
    // 如果不加 setTimeout validate 会先执行 然后数据才会变化
    setTimeout(() => {
      this.validate("change")
    })
  }

  /**
   * 获取当前 prop 对应的 value
   */
  getFieldValue() {
    // Form 组件上的 model props
    const model = this.props.formModel
    const { value } = this.props
    if (!model || !this.props.prop) return
    // element-reat 中有
    // const temp = this.props.prop.split(':');
    // return temp.length > 1 ? model[temp[0]][temp[1]] : model[this.props.prop];
    // 可以传有包含关系的两个字段 a:b => {a: {b:XX}}
    return model[this.props.prop] || value
  }

  /**
   * 获取校验规则
   * @return {Array} 返回当前字段 对应的 rules
   */
  getRules() {
    // Form 上 所有表单元素的校验规则
    const allRules = this.props.formRules
    // FormItem 上针对当前字段的校验规则
    const selfRules = this.props.rules

    if (!allRules && !selfRules) return

    // 从 allRules 中选取当前字段对应的 rules
    const currentRules = allRules ? allRules[this.props.prop] : []
    // 将 FormItem 上的 rules 和 Form 上该字段的 rules 合并
    // return [].concat(selfRules || currentRules || [])
    this.rules = [].concat(selfRules || currentRules || [])
    if (this.rules.length) {
      this.rules.forEach(rule => {
        if (rule.required) {
          this.required = true
        }
      })
    }
  }

  /**
   * 获取 没有 trigger 和 trigger 匹配的 rule
   * @param {*} trigger 触发条件 （change、blur。。。）
   */
  getFilteredRules(trigger) {
    const rules = this.rules
    if (!rules) return
    // 返回 没有 trigger 和 trigger match 的
    return rules.filter(rule => {
      return !rule.trigger || rule.trigger.indexOf(trigger) > -1
    })
  }

  /**
   * 校验 字段
   * @param {*} trigger 触发方式
   * @param {*} cb 回调
   */
  validate(trigger, cb) {
    const rules = this.getFilteredRules(trigger)
    // 有对应的规则 返回 true
    if (!rules || rules.length === 0) {
      if (cb instanceof Function) {
        cb()
      }
      return true
    }

    // 将 状态 切换为 validating: true
    this.setState({ validating: true })

    // 生成符合 validator 需要的 格式
    // fieldName: [rules]
    const descriptor = { [this.props.prop]: rules }
    // 生成 validator
    const validator = new AsyncValidator(descriptor)
    // 生成 符合校验格式的 数据 fieldName: value
    const model = { [this.props.prop]: this.getFieldValue() }
    return new Promise(resolve => {
      validator.validate(model, { firstFields: true }, errors => {
        this.setState(
          {
            error: errors ? errors[0].message : "",
            validating: false,
            valid: !errors
          },
          () => {
            if (cb instanceof Function) {
              resolve(errors)
              cb(errors)
            }
          }
        )
      })
    })
  }

  /**
   * 渲染 label
   */
  renderLabel() {
    const { label } = this.props
    if (!label) return
    const cls = classNames("form-item-label", {
      "form-item-required": this.required
    })
    return <label className={cls}>{label}</label>
  }

  /**
   * 渲染错误信息
   */
  renderErrorMessage() {
    if (this.state.valid) return
    return (
      <Transition in={!this.state.valid}>
        <span className="form-item-error">{this.state.error}</span>
      </Transition>
    )
  }

  renderHeader() {
    const { header } = this.props
    if (!header) return
    const cls = classNames("form-item-header", {
      "form-item-required": this.required
    })
    if (typeof header === "string") {
      return <h4 className={cls}>{header}</h4>
    } else {
      return (
        <div className={cls}>
          {header.label && (
            <span className="form-item-header-label">{header.label}</span>
          )}
          {header.content && (
            <span className="form-item-header-content">{header.content}</span>
          )}
        </div>
      )
    }
  }

  render() {
    const { label, children, style, className } = this.props

    const classes = classNames("form-item-wrapper", {
      "has-error": !this.state.valid
    })

    const formItemCls = classNames("form-item", {
      [className]: !!className
    })

    return (
      <div
        title={label}
        className={formItemCls}
        onBlur={this.handleBlur.bind(this)}
        onChange={this.handleChange}
        style={style}
        onClick={this.handleClick}
        onFocus={this.handleFocus}>
        {this.renderHeader()}

        {this.renderLabel()}

        <div className={classes}>
          {children}
          {this.renderErrorMessage()}
        </div>
      </div>
    )
  }
}
