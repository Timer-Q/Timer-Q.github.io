import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import moment from "moment"
import "./style/datepicker.scss"
import Icon from "../Icon"
import { getDays, weekDays, allMonths } from "./utils"

export default class DatePickerBase extends Component {
  static propTypes = {
    onChange: PropTypes.func,
    defaultSelected: PropTypes.any
  }

  constructor(props) {
    super(props)
    const currentYear = new Date().getFullYear()
    const currentMonth = new Date().getMonth()
    const currentDate = new Date().getDate()

    this.state = {
      days: getDays(currentYear, currentMonth),
      selectedDay: {
        years: currentYear,
        months: currentMonth,
        date: currentDate // 默认为当天
      },
      panelType: null,
      decadeYearsStart: null
    }
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.defaultSelected) return null

    const {
      years: prevYears,
      months: prevMonths,
      date: prevDate
    } = prevState.selectedDay

    const dateObj = moment(nextProps.defaultSelected).toObject()

    const { years, months, date } = dateObj

    let days
    if (years === prevYears && months === prevMonths) {
      if (date === prevDate) {
        return null
      }
    } else {
      days = getDays(years, months)
    }

    return {
      days: days || prevState.days,
      selectedDay: dateObj,
      decadeYearsStart: parseInt(dateObj.years / 10) * 10
    }
  }

  handleDateClick = (date, event, rest) => {
    event.stopPropagation()
    let { years, months } = date // eslint-disable-line
    if (months > 11) {
      date.years += 1
      date.months = 0
    }
    if (months < 0) {
      date.years -= 1
      date.months = 11
    }

    if (!("defaultSelected" in this.props)) {
      this.setState({ selectedDay: date, ...rest })
    }
    const { onChange } = this.props
    onChange && onChange(date)
    rest && this.setState({ ...rest })
  }

  renderTheader() {
    return weekDays.map(weekDay => {
      return <th key={weekDay}>{weekDay}</th>
    })
  }

  renderTbody() {
    const { days, selectedDay } = this.state
    if (!days) return
    let tr = []
    const dayList = []
    days.forEach((day, index) => {
      const isCurrentDate =
        selectedDay.years === day.years &&
        selectedDay.months === day.months &&
        selectedDay.date === day.date

      const dateCls = classNames("date", `date-${day.label}`, {
        "is-selected": isCurrentDate
      })
      
      const td = (
        <td
          key={index}
          className={dateCls}
          onClick={e => this.handleDateClick(day, e)}>
          {day.date}
        </td>
      )
      tr.push(td)
      if ((index + 1) % 7 === 0) {
        dayList.push(<tr key={index}>{tr}</tr>)
        tr = []
      }
    })
    return dayList
  }

  changeYear(perYear, event) {
    event.stopPropagation()
    const date = { ...this.state.selectedDay }
    date.years += perYear
    this.handleDateClick(date, event)
  }

  changeMonth(perMonth, event) {
    event.stopPropagation()
    const date = { ...this.state.selectedDay }
    date.months += perMonth
    this.handleDateClick(date, event)
  }

  chooseMonth(monthObj, event) {
    event.stopPropagation()
    const { selectedDay } = this.state
    const date = Object.assign({}, selectedDay, { months: monthObj.value })
    this.handleDateClick(date, event, { panelType: null })
  }

  chooseYear(years, event) {
    event.stopPropagation()
    const { selectedDay } = this.state
    const date = Object.assign({}, selectedDay, { years: years })
    this.handleDateClick(date, event, { panelType: null })
  }

  changeDecadeYear(step, event) {
    event.stopPropagation()
    let { decadeYearsStart } = this.state
    this.setState({ decadeYearsStart: (decadeYearsStart += step * 10) })
  }

  renderMonthPanel() {
    const { years } = this.state.selectedDay
    const { panelType } = this.state
    if (panelType !== "month") return null

    const { months: stateMonth } = this.state.selectedDay
    const monthNodes = allMonths.map((month, index) => {
      const cls = classNames("date-picker-panel-content-item", {
        "is-selected": stateMonth === month.value
      })
      return (
        <div key={index}>
          <span onClick={e => this.chooseMonth(month, e)} className={cls}>
            {month.label}
          </span>
        </div>
      )
    })

    const monthsHeader = (
      <div className="date-picker-title">
        <div className="date-picker-title-btn">
          <span onClick={e => this.changeYear(-1, e)}>{"<<"}</span>
        </div>
        <div className="date-picker-title-content">
          <span onClick={e => this.showPanel("year", e)}>{years}</span>
        </div>
        <div className="date-picker-title-btn">
          <span onClick={e => this.changeYear(1, e)}>{">>"}</span>
        </div>
      </div>
    )
    return (
      <div className="date-picker-panel">
        {monthsHeader}
        <div className="date-picker-panel-content">{monthNodes}</div>
      </div>
    )
  }

  renderYearPanel() {
    const { years } = this.state.selectedDay
    const { panelType } = this.state
    if (panelType !== "year") return null

    const { decadeYearsStart } = this.state
    const decadeYears = []
    let decadeYearsEnd
    for (let i = 0; i < 10; i++) {
      const currentYear = decadeYearsStart + i
      decadeYearsEnd = currentYear
      const cls = classNames("date-picker-panel-content-item", {
        "is-selected": years === currentYear
      })
      decadeYears.push(
        <div key={i}>
          <span onClick={e => this.chooseYear(currentYear, e)} className={cls}>
            {currentYear}
          </span>
        </div>
      )
    }

    const yearsHeader = (
      <div className="date-picker-title">
        <div className="date-picker-title-btn">
          <Icon
            onClick={e => this.changeDecadeYear(-1, e)}
            type="double-left"
          />
        </div>
        <div className="date-picker-title-content">
          <span onClick={e => this.showPanel("year", e)}>
            {decadeYearsStart} - {decadeYearsEnd}
          </span>
        </div>
        <div className="date-picker-title-btn">
          <Icon
            onClick={e => this.changeDecadeYear(1, e)}
            type="double-right"
          />
        </div>
      </div>
    )
    return (
      <div className="date-picker-panel">
        {yearsHeader}
        <div className="date-picker-panel-content">{decadeYears}</div>
      </div>
    )
  }

  showPanel(type, event) {
    event.stopPropagation()
    this.setState({ panelType: type })
  }

  render() {
    const { years, months, date } = this.state.selectedDay
    return (
      <div className="date-picker">
        <div className="date-picker-title">
          <div className="date-picker-title-btn">
            <Icon onClick={e => this.changeYear(-1, e)} type="double-left" />
            <Icon onClick={e => this.changeMonth(-1, e)} type="left" />
          </div>
          <div className="date-picker-title-content">
            <span onClick={e => this.showPanel("year", e)}>{years}</span> -
            <span onClick={e => this.showPanel("month", e)}>{months + 1}</span>
            -
            <span> {date}</span>
          </div>
          <div className="date-picker-title-btn">
            <Icon type="right" onClick={e => this.changeMonth(1, e)} />
            <Icon type="double-right" onClick={e => this.changeYear(1, e)} />
          </div>
        </div>
        <table className="date-picker-content">
          <thead>
            <tr>{this.renderTheader()}</tr>
          </thead>
          <tbody>{this.renderTbody()}</tbody>
        </table>
        {this.renderMonthPanel()}
        {this.renderYearPanel()}
      </div>
    )
  }
}
