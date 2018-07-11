import moment from "moment"
/**
 *
 * @param {*} years
 * @param {*} months 传入的 months 是从 0 开始计算
 * @return {*} days 返回 days 中的 months 也是从 1 开始计算
 */
export function getDays(years, months) {
  const baseNum = 7 * 6
  const days = []
  // 该月 第一天 是 周几
  const firstDayWeekDay = new Date(years, months).getDay()
  // 上个月最后一天
  const lastDateOfPreMonth = new Date(years, months, 0).getDate()
  // 该月最后一天
  const lastDate = new Date(years, months + 1, 0).getDate()

  for (let index = 0; index < baseNum; index++) {
    let dayObj = {}
    if (index - firstDayWeekDay < 0) {
      dayObj = {
        years,
        label: "pre",
        months: months - 1,
        date: lastDateOfPreMonth - firstDayWeekDay + 1 + index
      }
    } else if (index > lastDate + firstDayWeekDay - 1) {
      dayObj = {
        years,
        label: "after",
        months: months + 1,
        date: index - (lastDate + firstDayWeekDay) + 1
      }
    } else {
      dayObj = {
        years,
        label: "normal",
        months,
        date: index - firstDayWeekDay + 1
      }
    }
    days.push(dayObj)
  }
  return days
}

/**
 * 将日期格式化为 string 类型
 * @param {*} props
 * @param {*} date
 * @return {string} stringDate
 */
export function formatDate(props, date = new Date()) {
  const format = props.format || "YYYY-MM-DD"
  const stringDate = moment(date).format(format)
  return stringDate
}

export const weekDays = ["日", "一", "二", "三", "四", "五", "六"]
export const allMonths = [
  {
    label: "一月",
    value: 0
  },
  {
    label: "二月",
    value: 1
  },
  {
    label: "三月",
    value: 2
  },
  {
    label: "四月",
    value: 3
  },
  {
    label: "五月",
    value: 4
  },
  {
    label: "六月",
    value: 5
  },
  {
    label: "七月",
    value: 6
  },
  {
    label: "八月",
    value: 7
  },
  {
    label: "九月",
    value: 8
  },
  {
    label: "十月",
    value: 9
  },
  {
    label: "十一月",
    value: 10
  },
  {
    label: "十二月",
    value: 11
  }
]
