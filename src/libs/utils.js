import { isEmpty } from 'lodash'

export const getHeigthFromRatio = (type) => (width) => {
  switch (type) {
    case 'a4':
      const height = (width / 2480) * 3508
      return height
    default:
      return 0
  }
}

export const getWidthHeightText = (size, label, weight, font) => {
  const canvas = document.createElement('canvas')
  const ctx = canvas.getContext('2d')

  ctx.font = `${weight} ${size}px ${font}`
  const width = ctx.measureText(label).width

  canvas.remove()
  return {
    width,
    height: size - (0.2 * size),
  }
}

export const calculatePage = (position, maxHeight, startXLeft, startYRight) => {
  let newPosition = []
  let left = 0
  let right = 0
  let page = 1
  const initX = (p) => (maxHeight * (p - 1) + 10)

  for (let i = 0; i < position.length; i++) {
    const height = position[i].height
    if (left + height < maxHeight || right + height < maxHeight) {
      if (left > right) {
        newPosition.push({
          startX: startYRight,
          startY: initX(page) + right
        })
        right += height
      } else {
        newPosition.push({
          startX: startXLeft,
          startY: initX(page) + left
        })
        left += height
      }
    } else {
      left = height
      right = 0
      page += 1
      newPosition.push({
        startX: 10,
        startY: initX(page)
      })
    }
  }
  return {
    page,
    newPosition
  }
}
