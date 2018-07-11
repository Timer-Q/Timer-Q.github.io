# Button 实现

## 实现思路

1.  组件属性

| 属性 / 方法 | 说明                | 类型                      | 默认值 / 可选值              |
| :---------- | :------------------ | :------------------------ | :--------------------------- |
| ghost       | 是否是透明按钮      | boolean                   | false / [true / false]       |
| href        | 跳转的地址          | string                    | -                            |
| htmlType    | button 原生 type    | string                    | button / [button / submit]   |
| icon        | button 上的 icon    | string                    | -                            |
| loading     | 是否是 loading 状态 | boolean / {delay: number} | -                            |
| size        | button 大小         | string                    | -                            |
| type        | button 类型         | string                    | primary / [primary / danger] |
| onClick     | onClick 回调        | function                  | -                            |

---

2.  组件分析

> Button 组件主要是对样式的处理，还有 loading 状态的处理。

---

3.  组件实现

* 获取初始 loading 状态
  > 注： loading 状态下 按钮是不可点击的，实现该 功能是用的 css 中的 pointer-events: none

```jsx
  constructor(props) {
    super(props)
    this.state = {
      loading: props.loading
    }
  }

  componentWillUpdate(nextProps) {
    const preLoading = this.props.loading
    const curLoading = nextProps.loading
    if (preLoading) {
      clearTimeout(this.delayTimeout)
    }
    // NOTE: 延时 loading
    if (typeof loading !== "boolean" && curLoading && curLoading.delay) {
      this.delayTimeout = setTimeout(() => {
        this.setState({ loading: curLoading })
      }, curLoading.delay)
    } else {
      this.setState({ loading: curLoading })
    }
  }
```

* 渲染 Button

```jsx
render() {
  const {
    type,
    loading, // eslint-disable-line
    htmlType,
    size,
    children,
    icon,
    ghost, // eslint-desable-line
    ...otherProps
  } = this.props
  const loadingState = this.state.loading
  const classes = classNames("button", {
    [`button-${type}`]: type,
    [`button-${size}`]: size,
    "button-loading": loadingState,
    "button-ghost": ghost
  })

  const ComponentTag = otherProps.href ? "a" : "button"

  const iconNode = loadingState ? <i className="icon-loading " /> : icon

  return (
    <ComponentTag
      {...otherProps}
      type={otherProps.href ? undefined : (htmlType || "button")}
      className={classes}
      onClick={this.handleClick.bind(this)}
    >
      {iconNode}
      {children}
    </ComponentTag>
  )
}
```

---

4.  使用

```jsx
<Button href="/demo" type="danger" ghost>
  to demo
</Button>
```

---

5.  遇到问题

* 暂无

---

# Button 实现

## 实现思路

1.  组件属性
2.  组件分析

* ButtonGroup 主要是控制 Buttons 的  样式

---

3.  组件实现

```jsx
render() {
  const { children, ...otherProps } = this.props
  return <div {...otherProps} className="button-group">{children}</div>
}
```

---

4.  使用

```jsx
<Button.Group>
  <Button type="primary" icon={"1"}>
    default
  </Button>
</Button.Group>
```

---

5.  遇到问题

* 暂无
