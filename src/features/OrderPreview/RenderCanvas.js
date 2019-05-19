class RenderCanvas {
  constructor(orderList, width, height, padding, gap) {
    this.width = width
    this.height = height
    this.padding = padding
    this.gap = gap
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
  }

  getCurrentPosition() {
    this.changePosition()
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

export class RenderOrderCanvas {
  drawMultiText() {

  }

  drawText() {

  }
  drawLine() {

  }
  init() {

  }
}

export default RenderCanvas
