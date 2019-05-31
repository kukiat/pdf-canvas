import React, { Component } from 'react'
import CanvasLogic from '../canvas/CanvasLogic'
import CanvasRenderer from '../canvas/CanvasRenderer'
import { GAP, PADDING, WIDTH } from '../canvas/config'
import './index.scss'

class OrderPreview extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = null
    this.canvasLogic = new CanvasLogic(WIDTH, PADDING, GAP)
    this.canvasRenderer = new CanvasRenderer()
    this.imageData = null
  }

  componentDidMount() {
    this.draw()
  }

  draw() {
    this.canvasLogic.calculate(this.props.orderList)
    this.canvasRenderer.init(this.div, this.canvasLogic.pageSize, WIDTH)
    this.props.orderList.forEach(order => {
      const position = this.canvasLogic.getPosition(order.id)
      const page = position.pageNumber - 1
      this.canvasRenderer.drawContent(page, position)
      this.canvasRenderer.drawBarcode(page, position, order)
      this.canvasRenderer.drawQrcode(page, position, order)
    })
  }

  render() {
    return <div ref={node => (this.div = node)} />
  }
}

export default OrderPreview
