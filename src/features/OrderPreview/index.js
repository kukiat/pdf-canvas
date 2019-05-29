import React, { Component } from 'react'
import CanvasLogic from '../canvas/CanvasLogic'
import CanvasRenderer from '../canvas/CanvasRenderer'
import { GAP, PADDING, WIDTH } from '../canvas/config'

class OrderPreview extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = null
    this.canvasLogic = new CanvasLogic(WIDTH, PADDING, GAP)
    this.canvasRenderer = new CanvasRenderer()
  }

  componentDidMount() {
    this.draw()
  }

  draw() {
    this.canvasLogic.calculate(this.props.orderList)
    this.canvasRenderer.init(this.div, this.canvasLogic.position, WIDTH)
    let size = -1
    this.props.orderList.forEach(order => {
      const position = this.canvasLogic.getPosition(order.id)
      if (position.startX === 10 && position.startY === 10) {
        size++
      }
      this.canvasRenderer.drawContent(size, position)
      this.canvasRenderer.drawBarcode(size, position, order)
      this.canvasRenderer.drawQrcode(size, position, order)
    })
  }

  render() {
    return <div ref={node => (this.div = node)} />
  }
}

export default OrderPreview
