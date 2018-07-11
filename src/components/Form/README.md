# Form & FormItem 实现

1.  属性
> Form

| 属性 / 方法   | 说明                     | 类型     | 默认值 / 可选值    |
| :------------ | :----------------------- | :------- | :----------------- |
| model         | Form 数据对象            | any      | -                  |
| rules         | Form 校验规则            | object   | -                  |
| labelPosition | label 位置               | string   | [top, left, right] |
| header        | form header              | string   | -                  |
| subHeader     | form subHeader           | string   | -                  |
| onSubmit      | form onSubmit 事件       | function | -                  |
| validate      | 对整个表单进行校验的方法 | function | -                  |

> FormItem

| 属性 / 方法 | 说明            | 类型   | 默认值 / 可选值           |
| :---------- | :-------------- | :----- | :------------------------ |
| prop        | form model 字段 | string | Form model 中的某一项 key |
| label       | 标签文本        | string | -                         |

2.  组件分析

FormItem：

* 显示 label；
* 对 Input 的  value 进行校验，并显示错误信息。

Form 组件：

* label 显示位置
* 批量校验

3.  具体实现

FormItem 中的校验：校验使用的 [async-validator](https://github.com/yiminghe/async-validator)，校验规则按照 async-validator 要求 传入。

> 校验流程：

**onChange/onBlur => validate => getFilterRules => descriptor => model => validator.validate => setState**

* onChange/onBlur: React 事件
* validate：
  * getFilterRules: getRules => trigger => `rules` 从 rules 中筛选出 prop 对应的 rules（trigger 也要匹配）
  * descriptor： ({ _[prop]_ : rules}) => `validator`
  * model: getFieldValue => value => `{ _[prop]_ : value}`
  * validator.validate: validator.validate(model, errors => setState)

Form 中的校验：

* Form 会在 FormItem `componentDidMount` 的时候，获取到一个  放着 FormItem 引用的数组 `formItems`
* 调用 Form 的 `validate` 方法会对 `formItems` 中的每一项执行 validate

> note:

+ From 是如何获取 FormItem 的引用的：
  1'. 使用的 context：在 Form 中定义 `getChildContext` 生成 `context`，然后在子组件用通过 `this.context` 使用
  2'. 使用 createContext (v16.3+)
+ 再插一嘴双向绑定：（无时无刻不在想vue中v-model）
  + ant-design 自动实现了双向绑定，其使用 [rc-form](https://github.com/react-component/form) 实现的 Form 组件，[rc-form](https://github.com/react-component/form) 是一个高阶组件，将现有组件传入后，它会将双向绑定的方法作为 props 传给现有组件。

4.  使用

```jsx
handleSubmit() {
  this.form.validate(valid => {
    if (valid) {
      console.log("success")
    } else {
      console.log("error")
    }
  })
}
// render
<Form
  model={this.state.formData}
  labelPosition="right"
  rules={this.state.rules}
  onSubmit={this.handleSubmit.bind(this)}
  ref={node => (this.form = node)}
  header="form header"
  subHeader="form sub header"
>
  <Form.Item
    header="form item header"
    prop="largeInput"
    label="largeInputlabel"
  >
    <Input
      value={this.state.formData.defaultInput}
      prefix="2"
      suffix="3"
      placeholder="default Input"
      onChange={this.handleChange.bind(this, "defaultInput")}
    />
  </Form.Item>
</Form>
```

5. 遇到问题

+ 在 FormItem 中通过 `onChange` | `onBlur` 触发校验，校验用到的数据(model) 是 Input 通过 `onChange` 修改 state 得到的。然后会出现一种情况，在 Input `onChange` 完成后，setState 并没有立即更新 state 的值，导致 FormItem 校验用的model不是最新的。

```jsx
handleChange() {
  setTimeout(() => {
    this.validate("change")
  })
}
```