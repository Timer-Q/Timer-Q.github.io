
import { throttle } from "utils"

let stepIndex = 100

export function getStepIndex() {
  return stepIndex++
}

function handleScroll(cb) {
  return throttle(cb)
}

export default handleScroll
