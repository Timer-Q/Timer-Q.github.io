import React, { Component } from "react"
import PropTypes from "prop-types"
import moment from "moment"
import { formatOption } from "./utils"
import Selecter from "./Selecter"

export default class TimePickerPanel extends Component {
  static propTypes = {
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    hourOptions: PropTypes.array,
    minuteOptions: PropTypes.array,
    secondOptions: PropTypes.array,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    onChange: PropTypes.func,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool
  }

  onItemChange = (type, itemValue, option) => {
    const { onChange, value } = this.props
    let time = value
    if (!value) {
      time = moment("00:00:00", "HH:mm:ss")
    }
    if (type === "hour") {
      time.hour(+itemValue)
    }
    if (type === "minute") {
      time.minute(+itemValue)
    }
    if (type === "second") {
      time.second(+itemValue)
    }

    onChange(time, option)
  }

  renderHours = () => {
    const { hourOptions, defaultValue, showHour } = this.props
    if (!showHour) {
      return null
    }
    const value = this.props.value || defaultValue
    return (
      <Selecter
        type="hour"
        onSelect={this.onItemChange}
        options={hourOptions.map(option => formatOption(option))}
        selectedIndex={hourOptions.indexOf(value && value.hour())}
      />
    )
  }

  renderMinutes = () => {
    const { minuteOptions, defaultValue, showMinute } = this.props
    if (!showMinute) {
      return null
    }
    const value = this.props.value || defaultValue
    return (
      <Selecter
        type="minute"
        onSelect={this.onItemChange}
        options={minuteOptions.map(option => formatOption(option))}
        selectedIndex={minuteOptions.indexOf(value && value.minute())}
      />
    )
  }

  renderSeconds = () => {
    const { secondOptions, defaultValue, showSecond } = this.props
    if (!showSecond) {
      return null
    }
    const value = this.props.value || defaultValue
    return (
      <Selecter
        type="second"
        onSelect={this.onItemChange}
        options={secondOptions.map(option => formatOption(option))}
        selectedIndex={secondOptions.indexOf(value && value.second())}
      />
    )
  }

  render() {
    return (
      <div className="timepicker-panel">
        {this.renderHours()}
        {this.renderMinutes()}
        {this.renderSeconds()}
      </div>
    )
  }
}
