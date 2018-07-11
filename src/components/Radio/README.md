# Radio 实现

> 参照 Checkbox 的实现，将 `type`  换成 radio 即可。

---

# RadioGroup 实现

## 实现思路

radio 选中后不可取消，且一组 radios 只能有一个被选中。

1.  组件属性

| 属性 / 方法  | 说明          | 类型     | 默认值 / 可选值 |
| :----------- | :------------ | :------- | :-------------- |
| options      | CheckBox 对象 | array    | -               |
| defaultValue | 默认选中项    | string   | -               |
| value        | 指定选中项    | string   | -               |
| onChange     | onChange 回调 | function | -               |

---

2.  组件分析

---

3.  组件实现

* 获取初始 value 放到 state 中

```jsx
// getCheckedValue 的作用是获取 children 中 checked 是 true 的 value
constructor(props) {
  super(props)
  this.state = {
    value:
      props.value ||
      props.defaultValue ||
      this.getCheckedValue(props.children)
  }
}
```

* 通过 options 渲染 一组 Radio

```jsx
renderRadios() {
  const { disabled, options, name } = this.props
  const { value } = this.state
  if (options && options.length > 0) {
    return options.map((option, index) => {
      if (typeof option === "string") {
        return (
          <Radio
            key={index}
            disabled={disabled}
            value={option}
            onChange={this.handleChange.bind(this, option)}
            checked={value === option}
            name={name}
          >
            {option}
          </Radio>
        )
      } else {
        return (
          <Radio
            key={index}
            disabled={option.disabled || disabled}
            value={option.value}
            onChange={this.handleChange.bind(this, option)}
            checked={value === option.value}
            name={name}
          >
            {option.label}
          </Radio>
        )
      }
    })
  }
}
```

> 注：对比 CheckBoxGroup 通过 options 渲染 Checkbox 的方法，这种少了一次循环，但是写起来麻烦。

* onChange 处理

> 相较于 CheckboxGroup 的 onChange，RadioGroup 的 onChange 处理简单一下。整体思路是一样的。

```jsx
handleChange(option) {
  const preValue = this.state.value
  const curValue = option.value || option
  if (!("value" in this.props)) {
    this.setState({
      value: curValue
    })
  }
  const { onChange } = this.props
  if (onChange && preValue !== curValue) {
    // NOTE: 这里传入 curValue 还是 e 需再商定
    onChange(curValue)
  }
}
```

* 组件重新渲染 更新 state.value

```jsx
componentWillUpdate(nextProps) {
  if ("value" in nextProps) {
    this.setState({
      value: nextProps.value
    })
  } else {
    this.setState({
      value: this.getCheckedValue(nextProps.children)
    })
  }
}
```

---

4.  使用

```jsx
// state
this.state = {
  formData: {
    checkboxOptions: [
      "马蜂什么",
      "马什么窝",
      { value: "value", label: "什么蜂窝", disabled: true }
    ],
    radioGroup: "value"
  }
}

// render
<Radio.Group
  options={this.state.formData.checkboxOptions}
  value={this.state.formData.radioGroup}
  onChange={this.handleChange.bind(this, "radioGroup")}
/>
```

5. 遇到问题

* 暂无
