import React, { Component } from "react"
import ReactDOM from "react-dom"
import PropTypes from "prop-types"
import classNames from "classnames"
import { Provider } from "./context"
import Input from "../Input"
import Popover from "../Popover"
import Icon from "../Icon"
import { getMapKey, defaultFilterFn } from "./utils.js"

import "./style/select.scss"

export default class Select extends Component {
  static propTypes = {
    children: PropTypes.any,
    onBlur: PropTypes.func,
    onFocus: PropTypes.func,
    onChange: PropTypes.func,
    onSearch: PropTypes.func,
    onEnter: PropTypes.func,
    multiple: PropTypes.bool,
    value: PropTypes.oneOfType([
      PropTypes.array,
      PropTypes.string,
      PropTypes.number
    ]),
    defaultValue: PropTypes.oneOfType([PropTypes.array, PropTypes.string]),
    clearable: PropTypes.bool,
    disabled: PropTypes.bool,
    filterable: PropTypes.bool,
    placeholder: PropTypes.string,
    filterOption: PropTypes.func,
    filterDisabledOption: PropTypes.bool, // 是否过滤掉 disabled 状态的 option
    addonBefore: PropTypes.any,
    addonAfter: PropTypes.any,
    debounce: PropTypes.any,
    className: PropTypes.string,
    title: PropTypes.string,
    size: PropTypes.oneOf(["small", "default", "large"]),
    bordered: PropTypes.bool,
    style: PropTypes.object,
    isListenKeyboard: PropTypes.bool
  }

  static defaultProps = {
    filterDisabledOption: false,
    isListenKeyboard: true
  }

  constructor(props) {
    super(props)
    const optionsInfo = Select.getOptionsInfo(props)
    this.state = {
      inputValue: Select.getLabelFromValue(props, optionsInfo), // 输入过程中的 value； 用于suggest
      value: props.value || null,
      visible: false,
      keyupCacheIndex: 0
    }
  }

  /**
   * props 更新的时候 更新 state
   * @param {*} nextProps
   */
  static getDerivedStateFromProps(nextProps, prevState) {
    var optionsInfo = Select.getOptionsInfo(nextProps)
    if (!("value" in nextProps)) return null
    if (nextProps.value !== prevState.value) {
      return {
        inputValue: Select.getLabelFromValue(nextProps, optionsInfo), // 输入过程中的 value； 用于suggest
        value:
          nextProps.value !== undefined || nextProps.value !== null
            ? nextProps.defaultValue
            : nextProps.value // 选中的值
      }
    } else {
      return {
        value: nextProps.value || nextProps.defaultValue
      }
    }
  }

  componentDidUpdate() {
    // eslint-disable-next-line
    const optionsEl = ReactDOM.findDOMNode(this.dropDownEl)
    if (!optionsEl) return
    const optionsRect = optionsEl.getBoundingClientRect()
    const { keyupCacheIndex } = this.state
    // 如果有选中的值
    const selectedIndex =
      this.selectedIndex >= 0 ? this.selectedIndex : keyupCacheIndex

    const selectedOptionEl = optionsEl.children[selectedIndex]
    if (!selectedOptionEl) return
    const selectedOptionRect = selectedOptionEl.getBoundingClientRect()
    if (selectedOptionRect.top >= optionsRect.top + optionsRect.height) {
      optionsEl.scrollTop +=
        selectedOptionRect.top -
        (optionsRect.top + optionsRect.height) +
        selectedOptionRect.height
    }
    if (selectedOptionRect.top < optionsRect.top) {
      optionsEl.scrollTop -= optionsRect.top - selectedOptionRect.top
    }
  }

  /**
   * 将所有 option 转化成 string-value：{option, value, label} 这样形式的对象
   * @param {*} props
   */
  static getOptionsInfo(props) {
    const options = Select.getOptionsFromChildren(props.children)
    const optionsInfo = {}
    options.forEach(option => {
      optionsInfo[getMapKey(option.props.value)] = {
        option: option,
        value: option.props.value, // option 的 value
        label: option.props.label || option.props.children // option 显示的名字
      }
    })
    this.optionsInfo = optionsInfo
    return optionsInfo
  }

  /**
   * 获取所有options
   * @param {*} children
   * @param {*} options
   */
  static getOptionsFromChildren(children, options = []) {
    React.Children.forEach(children, child => {
      if (!child) return
      if (child.type.isSelectOptGroup) {
        Select.getOptionsFromChildren(child.props.children, options)
      } else {
        options.push(child)
      }
    })
    return options
  }

  /**
   * 通过 Select 的 value 和 optionsInfo 获取选中的值需要显示的label
   * @param {*} props
   * @param {*} optionsInfo 包含所有 option 信息的对象
   */
  static getLabelFromValue(props, optionsInfo) {
    // if (!optionsInfo) return
    const { value } = props
    let label = value
    if (value === undefined || value === null) {
      label = ""
    } else if (
      optionsInfo[getMapKey(value)] !== undefined &&
      optionsInfo[getMapKey(value)] !== null
    ) {
      label = optionsInfo[getMapKey(value)].label
    }
    return label
  }

  handleClick() {
    this.setState({
      visible: !this.state.visible
    })
  }

  handleToggleIconClick(event) {
    event.preventDefault()
    this.handleClick()
  }

  handleFocus(e) {
    const { onFocus } = this.props
    onFocus && onFocus(e)
  }

  handleBlur(e) {
    const { onBlur } = this.props
    onBlur && onBlur(e)
  }

  handleKeyDown(options, event) {
    if (!this.props.isListenKeyboard || !this.state.visible) return
    if (!event) return
    let { keyupCacheIndex } = this.state
    if (options && options.length) {
      const optionsLength = options.length
      if (event.key === "ArrowDown") {
        event.preventDefault()
        if (keyupCacheIndex < optionsLength - 1) {
          keyupCacheIndex++
        } else {
          keyupCacheIndex = optionsLength - 1
        }
      }
      if (event.key === "ArrowUp") {
        event.preventDefault()
        if (keyupCacheIndex > 0) {
          keyupCacheIndex--
        } else {
          keyupCacheIndex = 0
        }
      }
      this.setState(previousState => {
        if (keyupCacheIndex === previousState.keyupCacheIndex) return null
        return {
          keyupCacheIndex
        }
      })
    }
    if (event.key === "Enter") {
      this.optionClick(options[keyupCacheIndex])
      const { onEnter } = this.props
      setTimeout(() => {
        onEnter && onEnter(event)
      })
    }
  }

  /**
   * filterable && r 状态下 Input Change
   * @param {*} value input value
   */
  handleChange = value => {
    const { onSearch } = this.props
    onSearch && onSearch(value)
    this.setState({ inputValue: value, visible: true })
  }

  /**
   * 通过 输入的值 和 option
   * @param {*} input input 输入的值
   * @param {*} child option
   * @param {*} defaultFilter 过滤的方法
   */
  filterOption(input, child, defaultFilter = defaultFilterFn) {
    const { filterDisabledOption } = this.props
    if (!input) return true
    // TODO: 可以传入一个 filterOption，自定义过滤规则，后面规范一下
    let filterFn = this.props.filterOption

    if ("filterOption" in this.props) {
      if (this.props.filterOption === true) {
        filterFn = defaultFilter
      }
    } else {
      filterFn = defaultFilter
    }

    if (!this.props.filterable || !filterFn) {
      return true
    } else if (typeof filterFn === "function") {
      // 这个方法主要是这句
      return filterFn.call(this, input, child, filterDisabledOption)
    } else if (filterDisabledOption && child.props.disabled) {
      return false
    }
    return true
  }

  /**
   * 获取过滤后的 option
   * @param {*} children
   */
  renderFilterOptionsFromChildren(children = this.props.children) {
    let filteredOption = []
    const { inputValue, keyupCacheIndex } = this.state
    React.Children.forEach(children, (child, index) => {
      if (this.filterOption(inputValue, child)) {
        // TODO: ref
        const newChild = React.cloneElement(child, {
          key: index,
          isCached: keyupCacheIndex === index
        })
        filteredOption.push(newChild)
      }
    })
    if (
      !filteredOption ||
      (Array.isArray(filteredOption) && filteredOption.length === 0)
    ) {
      filteredOption = <div className="option">暂无数据</div>
    }
    return filteredOption
  }

  /**
   * TODO: mutiple 状态下 对 value 处理
   * option 中某一项点击的时候
   * @param {*} option
   */
  optionClick(option, index, event) {
    if (!option) return
    const { onChange } = this.props
    const {
      value: optionValue,
      children: optionChildren,
      label,
      disabled
    } = option.props

    if (disabled) return
    this.selectedIndex = index
    let { value, inputValue } = this.state

    // 两次选中的同一个值 不做处理
    if (value === optionValue && inputValue === optionChildren) return
    // 多选
    // if (multiple) {
    //   // TODO: multiple 状态下 有 toggle value 的操作
    //   inputValue.push(optionChildren)
    // } else {
    //   inputValue = optionChildren
    // }
    this.setState({
      value: optionValue,
      inputValue: label || optionChildren,
      visible: false
    })
    onChange && onChange(optionValue, event)
  }

  handleClear = () => {
    this.setState({
      inputValue: undefined
    })
  }

  render() {
    const {
      disabled,
      filterable,
      placeholder,
      children,
      addonBefore,
      addonAfter,
      onSearch,
      className,
      title,
      size,
      bordered,
      style
    } = this.props

    const { inputValue, value, visible } = this.state

    this._options = this.renderFilterOptionsFromChildren(children)

    const selectCls = classNames("select-wrapper", {
      "is-actived": visible,
      [className]: className
    })

    const dropdownCls = classNames("select-dropdown", {
      "is-opened": visible,
      [`select-${size}`]: size
    })

    const suffix = onSearch ? (
      <Icon type="search" />
    ) : (
      <Icon
        onClick={this.handleToggleIconClick.bind(this)}
        className={visible ? "suffix-rotate" : null}
        type="down"
      />
    )

    return (
      <div style={style} className={selectCls}>
        <Provider
          value={{
            selectedValue: value, // 用给 Option 判断是否选中
            optionClick: this.optionClick.bind(this), // 某一项 Option 点击时，可以获取到 点击的 Option，触发 Select 的 onChange 方法
            filterable: filterable // 是否 需要过滤
          }}>
          <Popover
            trigger="click"
            isShowPopper={visible}
            content={
              <div className="select-wrapper">
                <ul
                  className={dropdownCls}
                  ref={node => (this.dropDownEl = node)}>
                  {this._options}
                </ul>
              </div>
            }>
            <Input
              onFocus={this.handleFocus.bind(this)}
              onBlur={this.handleBlur.bind(this)}
              onClick={this.handleClick.bind(this)}
              onChange={this.handleChange}
              onKeyDown={this.handleKeyDown.bind(this, this._options)}
              value={inputValue}
              readonly={!filterable}
              disabled={disabled}
              suffix={suffix}
              placeholder={placeholder}
              addonBefore={addonBefore}
              addonAfter={addonAfter}
              title={title}
              size={size}
              bordered={bordered}
            />
          </Popover>
        </Provider>
      </div>
    )
  }
}
