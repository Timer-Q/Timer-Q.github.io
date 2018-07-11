# DatePicker

## 日期格式化思路

> moment.js 里面有个方法 toObject() 这就很舒服了

> DatePicker: defaultValue -> format -> setState(dateValue) -> onChange -> dateObject -> format

> DatePickerBase: defaultSelected -> toObject -> setState(selectedDay)

// TODO:

1. 切换月份 年份
2. 格式化处理
3. 禁用 disabled
4. showToday