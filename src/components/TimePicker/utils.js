/**
 * TimePicker utils
 */

/**
 * 根据传入的 时/分/秒 和对应的参数 初始化下拉 list 中的值
 */
export function generateOptions(
  length,
  disableOptions,
  hideDisableOptions,
  step = 1
) {
  const arr = []
  for (let i = 0; i < length; i += step) {
    if (
      !disableOptions ||
      disableOptions.indexOf(i) < 0 ||
      !hideDisableOptions
    ) {
      arr.push(i)
    }
  }
  return arr
}

/**
 * 格式化 option 小于 10 的前面补0
 * @param {*} option 传入的 option
 * @param {*} disableOptions 禁用的 options
 * @return {value, disabled}
 */
export const formatOption = (option, disableOptions) => {
  let value = `${option}`
  if (value < 10) {
    value = `0${option}`
  }
  const disabled = !!(disableOptions && disableOptions.indexOf(option) >= 0)
  return {
    value,
    disabled
  }
}

export function noop() {}

/**
 * 让选定的值 滚动到最上面
 * @param {*} container 包含 list 的 div
 * @param {*} to 要滚动到的位置
 * @param {*} duration 滚动间隔
 */
export const scrollTo = (container, to, duration) => {
  if (duration <= 0) {
    container.scrollTop = to
    return
  }
  const difference = to - container.scrollTop
  const perTick = difference / duration * 10

  requestAnimationFrame(() => {
    container.scrollTop = container.scrollTop + perTick
    if (container.scrollTop >= to) return
    scrollTo(container, to, duration - 10)
  })
}
