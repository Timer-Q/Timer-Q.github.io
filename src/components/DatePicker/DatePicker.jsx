import React, { Component } from "react"
import PropTypes from "prop-types"
import moment from "moment"
import Popover from "../Popover"
import Input from "../Input"
import Icon from "../Icon"
import DatePickerBase from "./DatePickerBase"
import { formatDate } from "./utils"

export default class DatePicker extends Component {
  static propTypes = {
    format: PropTypes.string,
    defaultValue: PropTypes.any,
    onChange: PropTypes.func
  }

  constructor(props) {
    super(props)
    this.state = {
      dateValue: props.defaultValue
        ? props.defaultValue
        : moment().format("YYYY-MM-DD")
    }
  }

  static getDerivedStateFromProps(nextProps) {
    if (!nextProps.defaultValue) return null
    return {
      dateValue: formatDate(nextProps, nextProps.defaultValue)
    }
  }

  handleChange = selectedDate => {
    const dateValue = formatDate(this.props, selectedDate)

    if (dateValue === this.state.dateValue) return

    this.setState({ dateValue })

    const { onChange } = this.props
    onChange && onChange(moment(selectedDate), dateValue)
  }

  render() {
    const { dateValue } = this.state
    return (
      <div>
        <Popover
          trigger="click"
          content={
            <DatePickerBase
              onChange={this.handleChange} // eslint-disable-line
              defaultSelected={dateValue}
            />
          }
          isCache={false}>
          <Input style={{width: "335px"}} value={dateValue} suffix={<Icon type="calendar-o"/>} />
        </Popover>
      </div>
    )
  }
}
