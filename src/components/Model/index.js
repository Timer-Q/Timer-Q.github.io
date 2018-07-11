import Model from "./Model"
import confirm from "./confirm"

Model.confirm = props => {
  const config = {
    type: "confirm",
    isShowCancel: true,
    ...props
  }
  return confirm(config)
}

Model.info = props => {
  const config = {
    type: "info",
    iconType: "info-circle-o",
    isShowCancel: false,
    ...props
  }
  return confirm(config)
}

Model.success = props => {
  const config = {
    type: "success",
    iconType: "check-circle-o",
    isShowCancel: false,
    ...props
  }
  return confirm(config)
}

Model.error = props => {
  const config = {
    type: "error",
    iconType: "exclamation-circle-o",
    isShowCancel: true,
    ...props
  }
  return confirm(config)
}

Model.warn = Model.warning = props => {
  const config = {
    type: "warning",
    iconType: "exclamation-circle-o",
    isShowCancel: true,
    ...props
  }
  return confirm(config)
}

export default Model
