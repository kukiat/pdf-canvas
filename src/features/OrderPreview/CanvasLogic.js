class CanvasLogic {
  constructor(width, height, padding, gap) {
    this.possition = new Map()
    this.width = width
    this.height = height
    this.padding = padding
    this.gap = gap
    this.left = 0
    this.right = 0
    this.currentSide = 'left'
    this.currentQr = 0
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

  setCheckPointQr(size) {
    this.currentQr = size
  }

  getCheckPointQr(width) {
    const area = this.currentSide === 'left' ? this.width / 2 : this.width
    return {
      x: area - (width + this.gap + this.padding),
      y: this.currentQr
    }
  }
  // updatePosition(id, data) {
  //   const currentData = this.possition.get(id)
  //   this.setPosition(id, {
  //     ...currentData,
  //     ...data
  //   })
  // }

  // sortPage() {

  // }

  // setPosition(id, data) {
  //   this.possition.set(id, data)
  // }

  // getPosition(id) {
  //   return this.possition.get(id)
  // }

  // calculate() {

  // }
}

export default CanvasLogic
