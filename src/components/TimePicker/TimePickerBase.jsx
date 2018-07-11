import React, { Component } from "react"
import PropTypes from "prop-types"
import TimePickerPanel from "./TimePickerPanel"
import { generateOptions, noop } from "./utils"

export default class TimePickerBase extends Component {
  static propTypes = {
    value: PropTypes.object,
    defaultValue: PropTypes.object,
    className: PropTypes.string,
    disabledHours: PropTypes.func,
    disabledMinutes: PropTypes.func,
    disabledSeconds: PropTypes.func,
    hideDisabledOptions: PropTypes.bool,
    showHour: PropTypes.bool,
    showMinute: PropTypes.bool,
    showSecond: PropTypes.bool,
    hourStep: PropTypes.number,
    minuteStep: PropTypes.number,
    secondStep: PropTypes.number,
    format: PropTypes.string,
    onChange: PropTypes.func
  }

  static defaultProps = {
    disabledHours: noop,
    disabledMinutes: noop,
    disabledSeconds: noop
  }

  handleChange = (value, option) => {
    const { onChange } = this.props
    onChange && onChange(value, option)
  }

  render() {
    const {
      disabledHours,
      hideDisabledOptions,
      hourStep,
      disabledMinutes,
      disabledSeconds,
      minuteStep,
      secondStep,
      format,
      value,
      defaultValue,
      showHour,
      showMinute,
      showSecond,
      ...rest
    } = this.props

    // 小时
    const disabledHourOptions = disabledHours()

    const hourOptions = generateOptions(
      24,
      disabledHourOptions,
      hideDisabledOptions,
      hourStep
    )

    // 分钟
    const disabledMinuteOptions = disabledMinutes()

    const minuteOptions = generateOptions(
      60,
      disabledMinuteOptions,
      hideDisabledOptions,
      minuteStep
    )

    // 秒
    const disabledSecondOptions = disabledSeconds()

    const secondOptions = generateOptions(
      60,
      disabledSecondOptions,
      hideDisabledOptions,
      secondStep
    )

    return (
      <div {...rest}>
        <TimePickerPanel
          value={value}
          defaultValue={defaultValue}
          onChange={this.handleChange}
          format={format}
          disabledHours={disabledHours}
          hourOptions={hourOptions}
          disabledMinutes={disabledMinutes}
          minuteOptions={minuteOptions}
          disabledSeconds={disabledSeconds}
          secondOptions={secondOptions}
          showHour={showHour}
          showMinute={showMinute}
          showSecond={showSecond}
        />
      </div>
    )
  }
}
