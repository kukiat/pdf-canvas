import React, { Component } from 'react'
import jsPDF from 'jspdf'
import CanvasLogic from '../canvas/CanvasLogic'
import CanvasRenderer from '../canvas/CanvasRenderer'
import { GAP, PADDING, WIDTH } from '../canvas/config'

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
    this.canvasRenderer.init(this.div, this.canvasLogic.position, WIDTH)
    this.props.orderList.forEach(order => {
      const position = this.canvasLogic.getPosition(order.id)
      const page = position.pageNumber - 1
      this.canvasRenderer.drawContent(page, position)
      this.canvasRenderer.drawBarcode(page, position, order)
      this.canvasRenderer.drawQrcode(page, position, order)
    })

    // this.imageData = this.canvasRenderer.ctx.canvas.toDataURL()
  }

  download = () => {
    const pdf = new jsPDF('p', 'pt', 'a4')
    this.canvasRenderer.ctx.forEach(canvas => {
      pdf.addImage(canvas.canvas.toDataURL(), 'PNG', 0, 0)
      pdf.addPage()
    })

    pdf.save('download.pdf')
  }

  render() {
    return (
      <div>
        <button onClick={this.download}>download</button>
        <div ref={node => (this.div = node)} />
      </div>
    )
  }
}

export default OrderPreview
