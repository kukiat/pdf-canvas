
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