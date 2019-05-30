export const getHeigthFromRatio = type => width => {
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
    height: size - 0.2 * size
  }
}

export const calculatePage = (positions, maxHeight, startXLeft, startYRight) => {
  const getOrderNumber = index => (index % 6) + 1
  let number = -1

  const newPosition = positions.map((position, index) => {
    const height = position.height
    console.log(position.height)
    switch (getOrderNumber(index)) {
      case 1:
        number += 1
        return {
          startX: 10,
          startY: 10,
          number
        }
      case 2:
        return {
          startX: startYRight,
          startY: 10,
          number
        }
      case 3:
        return {
          startX: 10,
          startY: height + 10,
          number
        }
      case 4:
        return {
          startX: startYRight,
          startY: height + 10,
          number
        }
      case 5:
        return {
          startX: 10,
          startY: height * 2 + 10,
          number
        }
      case 6:
        return {
          startX: startYRight,
          startY: height * 2 + 10,
          number
        }
      default:
        return {}
    }
  })

  console.log(newPosition)

  return {
    page: 1,
    newPosition
  }
}
