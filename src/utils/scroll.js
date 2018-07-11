/**
 * 滚动间隔 长度
 * @param {*} time
 * @param {*} currentScrollTop
 * @param {*} targetScrollTop
 * @param {*} duration
 */
function easeInOutCubic(t, b, c, d) {
  const cc = c - b
  t /= d / 2
  if (t < 1) {
    return (cc / 2) * t * t * t + b
  }
  return (cc / 2) * ((t -= 2) * t * t + 2) + b
}

export function getScroll(target, top) {
  if (typeof window === "undefined") {
    return 0
  }

  const prop = top ? "pageYOffset" : "pageXOffset"
  const method = top ? "scrollTop" : "scrollLeft"
  const isWindow = target === window

  let ret = isWindow ? target[prop] : target[method]
  // ie6,7,8 standard mode
  if (isWindow && typeof ret !== "number") {
    ret = window.document.documentElement[method]
  }

  return ret
}

export function getOffsetTop(element, container) {
  if (!element) {
    return 0
  }

  if (!element.getClientRects().length) {
    return 0
  }

  const rect = element.getBoundingClientRect()

  if (rect.width || rect.height) {
    if (container === window) {
      container = element.ownerDocument.documentElement
      return rect.top - container.clientTop
    }
    return rect.top - container.getBoundingClientRect().top
  }

  return rect.top
}

const duration = 400
// const bounding = 100
// const sharpMatcherRegx = /#([^#]+)$/

export function scrollTo(href, offsetTop = 85, getContainer, callback) {
  const container = getContainer && getContainer()
  const scrollTop = getScroll(container, true)
  // const sharpLinkMatch = sharpMatcherRegx.exec(href)
  // if (!sharpLinkMatch) {
  //   return
  // }
  const targetElement = document.getElementById(href)
  if (!targetElement) {
    return
  }
  const eleOffsetTop = getOffsetTop(targetElement, container)
  const targetScrollTop = scrollTop + eleOffsetTop - offsetTop
  const startTime = Date.now()
  const frameFunc = () => {
    const timestamp = Date.now()
    const time = timestamp - startTime
    const nextScrollTop = easeInOutCubic(
      time,
      scrollTop,
      targetScrollTop,
      duration
    )
    if (container === window) {
      window.scrollTo(window.pageXOffset, nextScrollTop)
    } else {
      container.scrollTop = nextScrollTop
    }
    if (time < duration) {
      requestAnimationFrame(frameFunc)
    } else {
      callback()
    }
  }
  requestAnimationFrame(frameFunc)
}
