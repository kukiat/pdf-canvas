class RenderCanvas {
  constructor(orderList, width, height, padding, gap) {
    this.positions = new Map()
    this.width = width
    this.height = height
    this.padding = padding
    this.gap = gap
    this.currentPosition = {
      left: {
        startX: 0 + padding,
        startY: 0 + padding
      },
      right: {
        startX: (width - gap) / 2 + padding,
        startY: 0 + padding
      }
    }
    this.left = 0
    this.right = 0
    this.currentSide = 'left'
  }

  changePosition() {
    if (this.left > this.right) {
      this.currentSide = 'right'
    } else {
      this.currentSide = 'left'
    }
  }

  setCurrentSizePosition(size) {
    this[this.currentSide] = size
    this.currentPosition[this.currentSide].startY = size
  }

  getcurrentPositions() {
    return this.currentPosition
  }

  setPosition(orderId) {
    const area = (this.width - this.gap) / 2
    const data = {
      left: {
        startX: 0 + this.padding,
        startY: this.padding + this.left
      },
      right: {
        startX: area + this.padding,
        startY: this.padding + this.right
      }
    }
    this.positions.set(String(orderId), data)
  }

  getCurrentPosition(orderId) {
    return this.positions.get(String(orderId))[this.currentSide]
  }

  initPosition(orderId) {
    this.changePosition()
    this.setPosition(orderId)
    if (this.currentSide === 'left') {
      return {
        startX: 0 + this.padding,
        startY: this.padding + this.left
      }
    }
    const area = (this.width - this.gap) / 2
    return {
      startX: area + this.padding,
      startY: this.padding + this.right
    }
  }
}

export default RenderCanvas
