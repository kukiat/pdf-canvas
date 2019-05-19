const WIDTH = 760
const PADDING = 10
const GAP = 10

class RenderCanvas {
  constructor() {
    this.position = new Map()
    // this.currectPosition = {
    //   left: {
    //     startX: 0 + PADDING,
    //     startY: 0 + PADDING
    //   },
    //   right: {
    //     startX: (WIDTH - GAP) / 2 + PADDING,
    //     startY: 0 + PADDING
    //   }
    // }
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

  getStartXY() {
    if (this.currentSide === 'left') {
      return {
        startX: 0 + PADDING,
        startY: PADDING + this.left
      }
    }
    const area = (WIDTH - GAP) / 2
    return {
      startX: area + PADDING,
      startY: PADDING + this.right
    }
  }
}

export default RenderCanvas
