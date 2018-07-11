export function fileToObject(file) {
  return {
    ...file,
    lastModified: file.lastModified,
    lastModifiedDate: file.lastModifiedDate,
    name: file.name,
    size: file.size,
    type: file.type,
    uid: file.uid,
    percent: 0,
    originFileObj: file
  }
}

/**
 * 数组去重
 * @param {*} data 源数据
 * @param {*} key 如果数组元素为对象 以 key 作为唯一值进行过滤
 */
export function uniqueArray(data, key) {
  if (Array.isArray(data)) {
    const arrayKey = {}
    const filterArray = []
    data.forEach(item => {
      // item 为 对象
      if (Object.prototype.toString.call(item) === "[object Object]" && key) {
        const itemKey = `${typeof item[key]}-${item[key]}`
        if (!arrayKey[itemKey]) {
          filterArray.push(item)
          arrayKey[itemKey] = true
        }
      } else {
        // item 为 基本类型
        const key = `${typeof item}-${item}`
        if (!arrayKey[key]) {
          filterArray.push(item)
          arrayKey[key] = true
        }
      }
    })
    return filterArray
  }
}

/**
 * 从 fileList 中获取与 file uid 一致的 数据
 * @param {*} file
 * @param {*} fileList
 */
export function getFileItem(file, fileList) {
  const matchKey = file.uid !== undefined ? "uid" : "name"
  return fileList.filter(item => item[matchKey] === file[matchKey])[0]
}

/**
 * 预览图片
 * readAsDataUrl
 * @param {*} file
 * @param {*} cb
 */
export function previewFile(file, cb) {
  const fileReader = new FileReader()
  fileReader.onloadend = () => cb(fileReader.result)
  fileReader.readAsDataURL(file)
}

const extname = url => {
  if (!url) {
    return ""
  }
  const temp = url.split("/")
  const filename = temp[temp.length - 1]
  // eslint-disable-next-line
  const filenameWithoutSuffix = filename.split(/\#|\?/)[0]
  return (/\.[^./\\]*$/.exec(filenameWithoutSuffix) || [""])[0]
}

export const isImageUrl = url => {
  const extension = extname(url)
  if (
    /^data:image\//.test(url) ||
    /(webp|svg|png|gif|jpg|jpeg|bmp)$/.test(extension)
  ) {
    return true
  } else if (/^data:/.test(url)) {
    // other file types of base64
    return false
  } else if (extension) {
    // other file types which have extension
    return false
  }
  return true
}

export function removeFileItem(file, fileList) {
  const matchKey = file.uid ? "uid" : "name"
  const restFileList = fileList.filter(
    item => item[matchKey] !== file[matchKey]
  )
  if (restFileList.length === fileList.length) return null
  return restFileList
}
