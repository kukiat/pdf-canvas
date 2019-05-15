import React from 'react';
import JsBarcode from 'jsbarcode'
import { ModalWrapper } from '../../commons'
import './index.scss'

class OrderPreview extends React.Component {
  constructor(props) {
    super(props)
    this.canvasRef = []
  }

  componentDidMount() {
    this.props.orderList.forEach(d => {
      const ctx = this.canvasRef[d.id].getContext('2d')
      ctx.filStyle = '#DFE1E5';
      ctx.lineWidth = 0.5;
      ctx.strokeStyle = "#000";
      ctx.strokeRect(20, 20, 420, 360)

      this.drawLine(ctx, 40, 100, 420, 100)
      this.drawLine(ctx, 280, 100, 280, 160)
      this.drawLine(ctx, 40, 160, 420, 160)

      this.drawText(ctx, d.orderName, 60, 143, 30, 'bold')
      this.drawText(ctx, d.orderId, 310, 125, 20, 'bold')
      this.drawText(ctx, '1 of 1', 330, 150, 15)

      this.drawText(ctx, `ผู้รับ: ${d.reciver.name} T: ${d.reciver.phoneNumber}`, 40, 190, 14, 'bold')
      this.drawText(ctx, `${d.reciver.address}`, 40, 210, 14, 'bold')

      this.drawText(ctx, `ผู้ส่ง: ${d.sender.name} T: ${d.sender.phoneNumber}`, 40, 240, 13)
      this.drawText(ctx, `${d.sender.address}`, 40, 260, 13)

      this.drawText(ctx, `${d.date}, (${d.type}), ${d.weight}`, 40, 300, 13)

      this.drawText(ctx, `หมายเหตุ: ${d.eg}`, 40, 330, 13)

      JsBarcode(`#barcode${d.id}`, d.barcode, {
        format: "CODE128B",
        lineColor: "#000",
        width: 1,
        height: 30,
        displayValue: true,
        text: d.barcode,
        fontSize: 12,
        font: 'verdana, sans-serif',
        textMargin: 5
      });
    })
  }

  drawText = (ctx, label = '', x, y, size, weight = 'normal') => {
    ctx.font = `${weight} ${size}px verdana, sans-serif`
    ctx.fillText(label, x, y)
  }

  drawLine = (ctx, moveToX, moveToY, lineToX, lineToY) => {
    ctx.beginPath()
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1.5
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
            <div style={{ position: 'relative' }}>
              <canvas id={`barcode${d.id}`} style={{ position: 'absolute', top: 30, left: 110 }} />
              <canvas
                ref={node => this.canvasRef[d.id] = node}
                width={460}
                height={400}
              />
            </div>
          ))
        }
      </div >
    );
  }
}

export default OrderPreview;
