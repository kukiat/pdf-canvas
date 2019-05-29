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

    this.imageData = this.canvasRenderer.ctx.canvas.toDataURL()
  }

  download = () => {
    const pdf = new jsPDF('p', 'pt', 'a4');
    const pageHeight = pdf.internal.pageSize.height;
    const canvases = [this.imageData, this.imageData, this.imageData]

    canvases.forEach((imageData) => {
      pdf.addImage(imageData, 'PNG', 35, 10);
      pdf.addPage();
    })

    pdf.save('download.pdf');
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
