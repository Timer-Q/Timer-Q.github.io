import React, { Component } from "react"
import PropTypes from "prop-types"
import moment from "moment" // eslint-disable-line
import TimePickerBase from "./TimePickerBase"
import classNames from "classnames"
import Input from "../Input"
import Popover from "../Popover"
import Icon from "../Icon"
import "./style/timepicker.scss"

export default class TimePicker extends Component {
  static propTypes = {
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    onChange: PropTypes.func,
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    format: PropTypes.string,
    className: PropTypes.string,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool,
    disabled: PropTypes.bool,
    clearable: PropTypes.bool,
    readonly: PropTypes.bool
  }

  static defaultProps = {
    showHour: true,
    showMinute: true,
    showSecond: true,
    // defaultValue: moment(),
    readonly: true
  }

  constructor(props) {
    super(props)
    this.state = {
      value: props.value || props.defaultValue
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if ("value" in nextProps || "defaultValue" in nextProps) {
      return {
        value: nextProps.value || nextProps.defaultValue
      }
    }
    return null
  }

  handleChange = value => {
    this.setValue(value)
  }

  handleClear(event) {
    event.stopPropagation()
    this.setValue(null)
  }

  setValue(value) {
    if (!("value" in this.props)) {
      this.setState({ value })
    }
    const { onChange } = this.props
    onChange && onChange(value, value && value.format(this.getFormat()))
  }

  getFormat() {
    const { format, showHour, showMinute, showSecond } = this.props
    if (format) {
      return format
    }

    return [
      showHour ? "HH" : "",
      showMinute ? "mm" : "",
      showSecond ? "ss" : ""
    ]
      .filter(item => !!item)
      .join(":")
  }

  render() {
    const { value } = this.state
    const {
      disabled,
      clearable,
      defaultValue,
      showHour,
      showMinute,
      showSecond,
      readonly,
      className,
      ...rest,
    } = this.props
    const suffix = clearable ? (
      <span onClick={e => this.handleClear(e)}>
        x
      </span>
    ) : (
      <Icon type="clock-circle-o" />
    )

    const cls = classNames("timepicker-wrapper", {
      [className]: className
    })

    return (
      <div className={cls}>
        <Popover
          content={
            <TimePickerBase
              onChange={this.handleChange}
              value={this.state.value}
              defaultValue={defaultValue}
              showHour={showHour}
              showMinute={showMinute}
              showSecond={showSecond}
            />
          }
          trigger="click"
          isCache={false}>
          <Input
            {...rest}
            style={{ width: "300px" }}
            suffix={suffix}
            disabled={disabled}
            value={(value && value.format(this.getFormat())) || ""}
            readonly={readonly}
          />
        </Popover>
      </div>
    )
  }
}
