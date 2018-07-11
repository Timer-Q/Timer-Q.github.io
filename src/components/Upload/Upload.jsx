import React, { Component } from "react"
import PropTypes from "prop-types"
import classNames from "classnames"
import Icon from "../Icon"
import defaultRequest from "./request.js"
import getUid from "./uid.js"
import {
  fileToObject,
  uniqueArray,
  getFileItem,
  removeFileItem
} from "./utils.js"
// import UploadList from "./UploadList"
import "./style/upload.scss"

export default class componentName extends Component {
  static propTypes = {
    beforeUpload: PropTypes.func,
    action: PropTypes.any,
    data: PropTypes.object,
    name: PropTypes.string,
    headers: PropTypes.object,
    withCredentials: PropTypes.bool,
    onChange: PropTypes.func,
    onProgress: PropTypes.func,
    onSuccess: PropTypes.func,
    onRemove: PropTypes.func,
    onError: PropTypes.func,
    onTypeError: PropTypes.func,
    onClick: PropTypes.func,
    fileList: PropTypes.array,
    defaultFileList: PropTypes.array,
    uploadText: PropTypes.string,
    maxFiles: PropTypes.number,
    size: PropTypes.string,
    className: PropTypes.string,
    accept: PropTypes.string,
    title: PropTypes.any,
    children: PropTypes.array,
    showProgress: PropTypes.bool
  }

  static defaultProps = {
    size: "normal",
    showProgress: true
  }

  constructor(props) {
    super(props)
    this.state = {
      fileList: props.fileList || props.defaultFileList || [],
      text: ""
    }
    this.reqs = {}
  }

  static getDerivedStateFromProps(nextProps, prevState) {
    return {
      fileList:
        nextProps.fileList ||
        nextProps.defaultFileList ||
        prevState.fileList ||
        []
    }
  }

  componentWillUnmount() {
    this.abort()
  }

  /**
   * 触发 props 中的 onChange
   * data: {
   *  file,
   *  fileList
   * }
   */
  onFileChange = data => {
    // 如果 props 中没有 fileList 可以组件内 setState 是界面刷新
    // 否则 将数据 通过 onChange 抛出去 爱咋地咋地
    if (!("fileList" in this.props)) {
      this.setState({ fileList: data.fileList })
    }
    // 触发 props 中的 onChange 事件
    const { onChange } = this.props
    onChange && onChange(data)
  }

  /**
   * input change 触发的事件
   * input[type=file] *onChange* -> upload -> request -> onStart -> onFileChange -> setState
   */
  onChange = e => {
    if (!e) return
    this.uploadFiles(e.target.files)
  }

  /**
   * 处理 文件多选的情况
   * @param {*} files
   */
  uploadFiles(files) {
    const postFiles = Array.prototype.slice.call(files)
    postFiles.forEach(file => {
      file.uid = getUid()
      this.upload(file, postFiles)
    })
  }

  beforeUpload(file, fileList) {
    const { beforeUpload } = this.props
    if (!this.checkFileType(file)) {
      return false
    }
    if (!beforeUpload) return true
    
    const result = beforeUpload(file, fileList)
    // beforeUpload 发生在 onStart 之前
    // onStart 中添加新上传的文件 然后 触发 props.onChange
    // beforeUpload return false 终止上传 即 不会触发 onStart
    // 此时需要 调用一下 onFileChange 将 处理的数据传出去 同时会 setState
    // beforeUpload 返回 false 也就是不上传了
    if (result === false) {
      file.status = "beforeUploading"
      this.onFileChange({
        file: fileToObject(file),
        fileList: uniqueArray(
          fileList.map(fileToObject).concat(this.state.fileList),
          "uid"
        )
      })
      return false
    } else if (result && result.then) {
      return result
    }
    return true
  }

  /**
   * 请求之前的处理
   * 触发 beforeUpload hook
   * beforeUpload oneOf [boolean, Promise]
   * @param {*} file
   */
  upload(file, fileList) {
    // 上传之前 hook
    const beforeUpload = this.beforeUpload(file, fileList)
    if (beforeUpload === true) {
      // 等待 promise 执行完
      return setTimeout(() => {
        this.post(file)
      }, 0)
    }
    if (beforeUpload.then) {
      beforeUpload
        .then(processedFile => {
          const processedFileType = Object.prototype.toString.call(
            processedFile
          )
          if (
            processedFileType === "[object File]" ||
            processedFileType === "[object Blob]"
          ) {
            return this.post(processedFile)
          }
          return this.post(file)
        })
        .catch(error => console.error(error))
    } else if (beforeUpload !== false) {
      setTimeout(() => this.post(file), 0)
    }
  }

  post = file => {
    const { props } = this
    new Promise(resolve => {
      const { action } = props
      if (typeof action === "function") {
        resolve(action(file))
      } else {
        resolve(action)
      }
    }).then(action => {
      const request = props.customRequest || defaultRequest
      const { data, name, headers } = props
      const { uid } = file
      this.reqs[uid] = request({
        action,
        filename: name || file.name,
        file,
        data,
        headers: headers,
        onProgress: e => {
          props.showProgress && this.onProgress(e, file)
        },
        onSuccess: (ret, xhr) => {
          this.onSuccess(ret, file, xhr)
        },
        onError: (err, ret) => {
          this.onError(err, ret, file)
        }
      })
      this.onStart(file)
    })
  }

  /**
   * 上传图片请求发出后 触发
   * 1. 给 state.fileList 增加一条
   * @param {*} file
   */
  onStart = file => {
    const currentFile = fileToObject(file)
    currentFile.status = "uploading"
    // copy 一份现有 fileList
    const nextFileList = this.state.fileList.concat([])
    nextFileList.push(currentFile)
    this.onFileChange({
      file: currentFile,
      fileList: nextFileList
    })
  }

  onProgress(e, file) {
    let fileList = this.state.fileList
    let targetItem = getFileItem(file, fileList)
    // removed
    if (!targetItem) {
      return
    }
    targetItem.percent = e.percent
    this.onFileChange({
      event: e,
      file: { ...targetItem },
      fileList: this.state.fileList
    })
    const { onProgress } = this.props
    onProgress && onProgress(e, file)
  }
  // eslint-disable-next-line
  onSuccess(response, file, xhr) {
    const { fileList } = this.state
    const currentFile = getFileItem(file, fileList)
    if (!currentFile) {
      return
    }
    currentFile.status = "done"
    currentFile.response = response
    this.onFileChange({
      file: { ...currentFile },
      fileList
    })
    const { onSuccess } = this.props
    onSuccess && onSuccess(response, file, xhr)
  }

  checkFileType(file) {
    const fileName = file.name
    const fileType = file.type // e.g video/mp4
    const { onTypeError } = this.props
    const accept = (this.props.accept || "").replace(/\s/g, "").toLowerCase()
    const acceptTypes = accept.split(",")

    if (acceptTypes.length > 0) {
      let fileTypeFound = false
      for (const index in acceptTypes) {
        // Allowing for both [extension, .extension, mime/type, mime/*]
        const extension =
          (acceptTypes[index].match(/^[^.][^/]+$/) ? "." : "") +
          acceptTypes[index]

        if (
          fileName.substr(-1 * extension.length).toLowerCase() === extension ||
          //If MIME type, check for wildcard or if extension matches the files tiletype
          (extension.indexOf("/") !== -1 &&
            ((extension.indexOf("*") !== -1 &&
              fileType.substr(0, extension.indexOf("*")) ===
                extension.substr(0, extension.indexOf("*"))) ||
              fileType === extension))
        ) {
          fileTypeFound = true
          break
        }
      }
      if (!fileTypeFound) {
        if (onTypeError) {
          onTypeError(file)
        }
        return false
      } else {
        return true
      }
    }
  }

  onError(error, response, file) {
    const { fileList } = this.state
    const targetItem = getFileItem(file, fileList)
    if (!targetItem) return
    targetItem.error = error
    targetItem.response = response
    targetItem.status = "error"
    this.onFileChange({
      file: { ...targetItem },
      fileList
    })
    const { onError } = this.props
    onError && onError(error, response, file)
  }

  abort(file) {
    const { reqs } = this
    if (file) {
      if (file.uid) {
        const uid = file.uid
        reqs[uid] && reqs[uid].abort()
        delete reqs[uid]
      }
    } else {
      Object.keys(reqs).forEach(uid => {
        if (reqs[uid]) {
          reqs[uid].abort()
          delete reqs[uid]
        }
      })
    }
  }

  handleRemove = (file, isReupload, fileList = this.state.fileList) => {
    const restFileList = removeFileItem(file, fileList)
    const { onRemove } = this.props
    restFileList &&
      this.onFileChange({
        file,
        fileList: restFileList
      })
    isReupload && this.post(file)
    onRemove && onRemove(file)
    this.abort(file)
  }

  handleUploadClick = () => {
    const { onClick } = this.props
    onClick && onClick()
    this.fileInput.click()
  }

  render() {
    const { fileList } = this.state

    const {
      uploadText,
      maxFiles,
      size,
      className,
      title,
      children,
      accept,
      ...rest
    } = this.props

    const isMax =
      fileList.length === 0 || maxFiles ? fileList.length < maxFiles : true

    const cls = classNames("upload", {
      [className]: !!classNames
    })

    const newChildren = React.Children.map(children, child => {
      return React.cloneElement(child, {
        post: this.post.bind(this),
        onRemove: this.handleRemove.bind(this),
        size,
        ...rest
      })
    })

    const selectCls = classNames("upload-select", {
      [`upload-select-${size}`]: size
    })

    return (
      <div className={cls}>
        {title && <div className="upload-title">{title}</div>}
        <div className="upload-list">{newChildren}</div>
        {isMax && (
          <div className={selectCls} onClick={this.handleUploadClick}>
            <span className="upload-select-text">
              <Icon type="plus" /> {uploadText || "上传图片"}
            </span>
            <input
              style={{ display: "none" }}
              type="file"
              ref={node => (this.fileInput = node)}
              onChange={this.onChange}
              accept={accept}
            />
          </div>
        )}
      </div>
    )
  }
}
