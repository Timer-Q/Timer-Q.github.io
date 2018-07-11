# Input 组件实现

## 实现思路

1.  组件属性

| 属性 / 方法  | 说明                   | 类型               | 默认值 / 可选值                   |
| :----------- | :--------------------- | :----------------- | :-------------------------------- |
| value        | input value            | any                | -                                 |
| defaultValue | input 默认 value       | any                | -                                 |
| disabled     | input 是否禁用         | any                | false / [true, false]             |
| onChange     | input onChange 方法    | function           | -                                 |
| id           | input id               | string             | -                                 |
| type         | htmlDom input 类型     | string             | text / [number...]                |
| size         | input 大小             | string             | default / [small, default, large] |
| prefix       | 带图标前缀的 input     | string / ReactNode | -                                 |
| suffix       | 带图标后缀的 input     | string / ReactNode | -                                 |
| addonBefore  | 带前置标签的 input     | string / ReactNode | -                                 |
| addonAfter   | 带后 ÎÎ 置标签的 input | string / ReactNode | -                                 |

---

2.  组件分析

input 组件有三种形态，根据这个形态，可以用 三个方法 来渲染

* 普通 input
  `renderInput`
* 前 | 后 带 icon
  `renderInputWithIcon`
* 前 | 后 带 addon
  `renderInputWithAddon`

---

3.  组件实现

> 先解释两个概念： 受控组件 & 非受控组件 (参考[React 表单-受控组件与非受控组件](https://itbilu.com/javascript/react/4ki9qFFqg.html))

* 受控组件：受控组件也被称做“受限组件”或“受约束组件”。受控组件与其它 React 组件行为一样，其所有状态属性的更改都由 React 来控制，也就是说它根据组件的 props 和 state 来改变组件的 UI 表现形式。

* 非受控组件：非受控组件相对于普通 React 组件或受控组件来说是一种反模式。非受控组件不受 React 的状态控制（state 或 props）。

* `React 对 input 中的 value 进行了管理。所以，会有 input 上的 value 改不掉的时候。`

*renderInput*实现

```jsx
// fix warning: A component is changing an uncontrolled input of type text to be controlled. ...
fixControlledValue(value) {
  if (typeof value === "undefined" || value === null) {
    return ""
  }
  return value
}

handleChange(e) {
  e.preventDefault()
  const { onChange } = this.props
  if (onChange) {
    onChange(e.target.value)
  }
}

renderInupt() {
  const {
    type,
    addonBefore, // eslint-disable-line
    addonAfter, // eslint-disable-line
    prefixClass, // eslint-disable-line
    autoComplete,
    ...otherProps
  } = this.props

  if ("value" in this.props) {
    otherProps.value = this.fixControlledValue(otherProps.value)
    delete otherProps.defaultValue
  }
  return this.renderInputWithIcon(
    <input
      {...otherProps}
      type={type}
      onChange={this.handleChange.bind(this)}
      className={this.getInputClassName()}
      autoComplete={autoComplete}
    />
  )
}
```

4.  使用

```jsx
asyncSetState(state) {
    return new Promise(resolve => {
      this.setState(state, resolve)
    })
  }

async handleChange(name, value) {
  await this.asyncSetState({
    formData: Object.assign({}, this.state.formData, { [name]: value })
  })
  console.log(this.state.formData)
}

// ...
<Input
  value={this.state.formData.defaultInput}
  prefix="2"
  suffix="3"
  placeholder="default Input"
  onChange={this.handleChange.bind(this, "defaultInput")}
/>
```

> note:

* 关于 defaultValue： 如果想使  组件变成 非受控组件 可以使用 defaultValue 属性。
* 关于‘双向绑定’： React 中没有指令，没法像 v-model 一样方便；这里用的笨方法，通过暴露 `onChang (相当于 vue 中的 @input)` 处理数据。ant-design 中在 From & FormItem 层面  自动实现了'双向绑定'.
* 关于 setState: setState 不是同步操作。
* 关于 width: 100%; : 不同场景下需要不同长度的 input，Input 是基础组件，使用时需要在 Input 外层限定宽度。

5.  遇到问题

* uncontrolled <=> controlled
* el[display: inline] 内部 el 的 box-shadow 会被遮住。

// TODO:

1. addon text-overflow
2. textarea autosize
3. input cleable
