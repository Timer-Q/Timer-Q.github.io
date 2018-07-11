import React from "react"

/**
 * 获取 当前 index 及其父元素index 组成的 indexPath
 * @param {*} indexPath 父元素的 indexPath
 * @param {*} currentIndex 当前 index
 * @return 包含当前 index 的 indexPath
 */
function getIndexPath(indexPath, currentIndex) {
  if (indexPath) {
    indexPath = indexPath.slice()
    indexPath.indexOf(currentIndex) < 0 && indexPath.push(currentIndex)
    return indexPath
  } else {
    return [currentIndex]
  }
}

/**
 * 加工 children
 * @param {*} props
 * @param {*} anchor 是否渲染 锚点
 *
 * @return 如果 child 是 ReactDOM 增加 indexPath prop
 */
export function renderChildren(instance) {
  const { children, indexPath, handleSelect } = instance.props
  const newChildren = React.Children.map(children, child => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, {
        indexPath: getIndexPath(indexPath, child.props.index),
        handleSelect
      })
    } else {
      return child
    }
  })
  return newChildren
}

export function loopMenuItemRecursively(children, keys, ret) {
  if (!children || ret.isChildrenSelected) {
    return
  }
  React.Children.forEach(children, c => {
    if (c) {
      const construct = c.type
      if (
        !construct ||
        !(
          construct.isSubMenu ||
          construct.isMenuItem ||
          construct.isMenuItemGroup
        )
      ) {
        return
      }
      if (keys && keys.indexOf(c.key) !== -1) {
        ret.isChildrenSelected = true
      } else if (c.props.children) {
        loopMenuItemRecursively(c.props.children, keys, ret)
      }
    }
  })
}
