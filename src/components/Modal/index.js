import Modal from "./Modal"
import confirm from "./confirm"

Modal.confirm = props => {
  const config = {
    type: "confirm",
    isShowCancel: true,
    ...props
  }
  return confirm(config)
}

Modal.info = props => {
  const config = {
    type: "info",
    iconType: "info-circle-o",
    isShowCancel: false,
    ...props
  }
  return confirm(config)
}

Modal.success = props => {
  const config = {
    type: "success",
    iconType: "check-circle-o",
    isShowCancel: false,
    ...props
  }
  return confirm(config)
}

Modal.error = props => {
  const config = {
    type: "error",
    iconType: "exclamation-circle-o",
    isShowCancel: true,
    ...props
  }
  return confirm(config)
}

Modal.warn = Modal.warning = props => {
  const config = {
    type: "warning",
    iconType: "exclamation-circle-o",
    isShowCancel: true,
    ...props
  }
  return confirm(config)
}

export default Modal
