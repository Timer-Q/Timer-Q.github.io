# Checkbox 实现

## 实现思路

1.  组件属性

| 属性 / 方法    | 说明           | 类型     | 默认值 / 可选值               |
| :------------- | :------------- | :------- | :---------------------------- |
| type           | type 属性      | string   | checkbox / [checkbox / radio] |
| disabled       | disabled 状态  | boolean  | false / [true / false]        |
| readOnly       | readOnly 状态  | boolean  | false / [true / false]        |
| onClick        | onClick 事件   | function | -                             |
| onChange       | onClick 事件   | function | -                             |
| onFocus        | onClick 事件   | function | -                             |
| onBlur         | onClick 事件   | function | -                             |
| checked        | 是否被选中     | boolean  | [true / false]                |
| defaultChecked | 初始是否被选中 | boolean  | [true / false]                |

---

2.  组件分析

Checkbox 通过 checked 属性 判断是否被选中，通过 onChange 改变 checked 的值。另：Radio 的表现基本与 CheckBox 一致，故在 Radio 中复用了 CheckBox 组件。

---

3.  组件实现

```jsx
<input
  {...otherProps}
  className={checkboxClasses}
  type={type}
  disabled={disabled}
  readOnly={readOnly}
  onClick={onClick}
  onChange={this.handleChange.bind(this)}
  onFocus={onFocus}
  onBlur={onBlur}
  value={value}
  checked={!!checked}
/>
```

* checked state 初始化

```jsx
constructor(props) {
  super(props)
  const checked = "checked" in props ? props.checked : props.defaultChecked

  this.state = {
    checked
  }
}
```

* 对 onChange 进行处理

```jsx
handleChange(e) {
  const { onChange, disabled } = this.props

  if (disabled) return

  // 如果 props 中没有传入 checked, 直接修改 state 完成渲染；
  // 如果 checked 是 props 传入的，需要在父组件处理
  if (!("checked" in this.props)) {
    this.setState({
      checked: e.target.checked
    })
  }

  if (onChange) {
    onChange(e.target.checked, this.props)
  }
}
```

* 组件更新后，重新获取 checked 状态

```jsx
componentWillUpdate(nextProps) {
  if ("checked" in nextProps) {
    this.setState({
      checked: nextProps.checked
    })
  }
}
```

---

4.  使用

```jsx
<Checkbox onChange={this.handleChange.bind(this, "checkboxValue")}>
  你点我，你点了我，我就和你嘿嘿嘿嘿嘿嘿嘿嘿嘿
</Checkbox>
```

---

5.  遇到问题

* 暂无

---

# CheckboxGroup 实现

## 实现思路

1.  组件属性

| 属性 / 方法  | 说明          | 类型     | 默认值 / 可选值 |
| :----------- | :------------ | :------- | :-------------- |
| options      | CheckBox 对象 | array    | -               |
| defaultValue | 默认选中项    | array    | -               |
| value        | 指定选中项    | array    | -               |
| onChange     | onChange 回调 | function | -               |

---

2.  组件分析

CheckboxGroup 可以通过 options 批量渲染 Checkbox。

---

3.  组件实现

* 获取 `value(默认选中的项)`

```jsx
constructor(props) {
  super(props)
  this.state = {
    value: props.value || props.defaultValue || []
  }
}
```

* 获取 `options(需要渲染的项)`, 如果 option 是字符串，格式化成组件需要的格式 `{label: str, value: str}`

```jsx
getOptions() {
  const { options } = this.props
  return options.map(option => {
    if (typeof option === "string") {
      return {
        value: option,
        label: option
      }
    }
    return option
  })
}
```

* onChange 处理

```jsx
/**
 * 判断 现在 state.value 中有没有 opstion.value，没有就 push 进去，有就 splice 掉
 * 最后将 value 传给 onChange 的回调中
 * */
toggleOption(optionData) {
  const optionIndex = this.state.value.indexOf(optionData.value)
  const value = [...this.state.value]
  if (optionIndex === -1) {
    value.push(optionData.value)
  } else {
    value.splice(optionIndex, 1)
  }
  // 如果 state 中的 value 是由 props 中的 value 初始化而来 则不允许直接修改 value
  // 而是通过 onChange 方法将现在的 value 抛出去 由父组件修改
  if (!("value" in this.props)) {
    this.setState({ value })
  }

  const { onChange } = this.props
  if (onChange) {
    onChange(value)
  }
}
```

* 组件重新渲染后 更新 state.value

```jsx
componentWillUpdate(nextProps) {
  if ("value" in nextProps) {
    this.setState({
      value: nextProps.value || []
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
    checkedList: ["马蜂什么", "value"],
  }
}

// render
<Checkbox.Group
  options={this.state.formData.checkboxOptions}
  value={this.state.formData.checkedList}
  onChange={this.handleChange.bind(this, "checkedList")}
/>
```

---

5.  遇到问题

* 暂无
