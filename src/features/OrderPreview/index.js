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
    const { width, height } = this.canvasLogic.getPageSize()
    this.canvasRenderer.init(this.div, width, height)

    this.props.orderList.forEach(order => {
      const position = this.canvasLogic.getPosition(order.id)
      this.canvasRenderer.drawContent(position)
      this.canvasRenderer.drawBarcode(position, order)
      this.canvasRenderer.drawQrcode(position, order)
    })
  }

  render() {
    return <div ref={node => (this.div = node)} />
  }
}

export default OrderPreview
