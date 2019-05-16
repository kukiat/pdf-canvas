import React, { createRef } from 'react';
import JsBarcode from 'jsbarcode'
import { ModalWrapper } from '../../commons'
import './index.scss'

const WIDTH = 460
const HEIGHT = 400
class OrderPreview extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = []
  }

  componentDidMount() {
    this.drawCanvas()
  }

  componentDidUpdate() {
    this.drawCanvas()
  }

  drawCanvas = () => {
    const { orderList } = this.props
    orderList.forEach(d => {
      const ctx = this.canvasRef[d.id].getContext('2d')
      ctx.canvas.width = WIDTH
      ctx.canvas.height = HEIGHT
      this.drawRact(ctx, WIDTH, HEIGHT, 10)

      this.drawLine(ctx, 20, 100, 440, 100)
      this.drawLine(ctx, 300, 100, 300, 160)
      this.drawLine(ctx, 20, 160, 440, 160)

      this.drawText(ctx, d.orderName, 60, 143, 30, 'bold')
      this.drawText(ctx, d.orderId, 330, 125, 20, 'bold')
      this.drawText(ctx, '1 of 1', 350, 150, 15)

      this.drawText(ctx, `ผู้รับ: ${d.reciver.name} T: ${d.reciver.phoneNumber}`, 20, 190, 14, 'bold')
      this.drawText(ctx, `${d.reciver.address}`, 20, 210, 14, 'bold')

      this.drawText(ctx, `ผู้ส่ง: ${d.sender.name} T: ${d.sender.phoneNumber}`, 20, 240, 13)
      this.drawText(ctx, `${d.sender.address}`, 20, 260, 13)

      this.drawText(ctx, `${d.date}, (${d.type}), ${d.weight}`, 20, 300, 13)

      this.drawText(ctx, `หมายเหตุ: ${d.eg}`, 20, 330, 13)

      JsBarcode(`#barcode${d.id}`, d.barcode, {
        format: "CODE128B",
        lineColor: "#000",
        width: 1.5,
        height: 40,
        displayValue: true,
        text: d.barcode,
        fontSize: 12,
        font: 'verdana, sans-serif',
        textMargin: 5
      });
    })
  }

  drawRact = (ctx, width, height, borderRadius) => {
    this.drawLine(ctx, 5, 0 + borderRadius, 5, height - borderRadius)
    this.drawLine(ctx, 0 + borderRadius, 395, width - borderRadius, 395)
    this.drawLine(ctx, 455, height - borderRadius, 455, 0 + borderRadius)
    this.drawLine(ctx, width - borderRadius, 5, 0 + borderRadius, 5)
  }

  drawText = (ctx, label = '', x, y, size, weight = 'normal') => {
    ctx.font = `${weight} ${size}px verdana, sans-serif`
    ctx.fillText(label, x, y)
  }

  drawLine = (ctx, moveToX, moveToY, lineToX, lineToY) => {
    ctx.beginPath()
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    ctx.moveTo(moveToX, moveToY)
    ctx.lineTo(lineToX, lineToY)
    ctx.stroke()
  }

  render() {
    const { orderList } = this.props
    return (
      <div className="order-list-container">
        {
          orderList.map((d) => (
            <div
              style={{ position: 'relative', padding: '5px' }}
              key={d.id}
            >
              <canvas
                id={`barcode${d.id}`}
                style={{ position: 'absolute', top: 20, left: 60 }}
              />
              <canvas ref={node => this.canvasRef[d.id] = node} />
            </div>
          ))
        }
      </div >
    );
  }
}

export default OrderPreview;
