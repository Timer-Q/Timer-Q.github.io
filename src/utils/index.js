export function debounce(cb, delay = 800) {
  let timer

  return function() {
    const context = this
    const args = arguments
    clearTimeout(timer)
    timer = setTimeout(() => {
      cb && cb.apply(context, args)
    }, delay)
  }
}

export function throttle(cb, wait = 200) {
  let last
  let timer
  return function() {
    const context = this
    const args = arguments
    const now = Date.now()

    if (last && now < last + wait) {
      clearTimeout(timer)
      timer = setTimeout(() => {
        last = now
        cb.apply(context, args)
      }, wait)
    } else {
      last = now
      cb.apply(context, args)
    }
  }
}

export { scrollTo } from "./scroll"
