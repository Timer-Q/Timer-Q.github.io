export function getMapKey(value) {
  return `${typeof value}-${value}`
}

/**
 * 匹配 label 和 输入的值
 * @param {*} input 输入的值
 * @param {*} child 一项option
 * @param {*} filterDisabledOption 是否过滤掉 disabled 的 option
 */
export function defaultFilterFn(input, child, filterDisabledOption) {
  const { disabled, children, label } = child.props

  if (filterDisabledOption && disabled) {
    return false
  }

  const value = label || children
  if (value !== undefined && value !== null) {
    return `${value}`.toLowerCase().indexOf(`${input}`.toLowerCase()) > -1
  } else {
    return false
  }
}
