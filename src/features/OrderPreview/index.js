import React, { Component } from 'react';
import JsBarcode from 'jsbarcode'

function getHeightText(height) {
  return height - (0.2 * height)
}

const WIDTH = 370
const HEIGHT = 400
const PADDING = 10
class OrderPreview extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = null
  }

  componentDidMount() {
    this.drawCanvas()
  }

  componentDidUpdate() {
    this.drawCanvas()
  }

  drawCanvas = () => {
    const order = this.props.orderList[0]
    const startX = 0
    const startY = 0
    const endX = 0
    const endY = 0
    const ctx = this.canvasRef.getContext('2d')
    ctx.canvas.width = WIDTH
    ctx.canvas.height = HEIGHT
    const localPadding = 10
    // this.drawRact(ctx, WIDTH, HEIGHT, 10)
    this.drawLine(ctx, PADDING, PADDING, WIDTH - PADDING, PADDING)
    this.drawLine(ctx, PADDING, PADDING, PADDING, 500)
    this.drawLine(ctx, WIDTH - PADDING, PADDING, WIDTH - PADDING, 500)
    const barcodeAreaHeight = 100
    const headerAreaHeigth = 60
    const offsetYSepLine = 0.7 * (WIDTH - (localPadding * 2) - (PADDING * 2))
    this.drawLine(ctx, PADDING + localPadding, barcodeAreaHeight + PADDING, WIDTH - localPadding - PADDING, barcodeAreaHeight + PADDING)
    this.drawLine(ctx, PADDING + localPadding, barcodeAreaHeight + headerAreaHeigth + PADDING, WIDTH - localPadding - PADDING, barcodeAreaHeight + headerAreaHeigth + PADDING)
    this.drawLine(ctx, offsetYSepLine, barcodeAreaHeight + PADDING, offsetYSepLine, barcodeAreaHeight + PADDING + headerAreaHeigth)

    const fontSizeOrderName = 22
    const heightText = getHeightText(fontSizeOrderName)
    const offsetYOrderName = PADDING + barcodeAreaHeight + heightText + ((headerAreaHeigth - heightText) / 2)
    ctx.font = `bold ${fontSizeOrderName}px verdana, sans-serif`
    const offsetXOrderName = ((offsetYSepLine - ctx.measureText(order.orderName).width) / 2)
    this.drawText(ctx, order.orderName, offsetXOrderName + PADDING, offsetYOrderName, fontSizeOrderName, 'bold')

    // this.drawText(ctx, order.orderId, 330, 125, 20, 'bold')
    // this.drawText(ctx, '1 of 1', 350, 150, 15)

    // this.drawLine(ctx, 0 + borderRadius, 395, width - borderRadius, 395)
    // this.drawLine(ctx, 455, height - borderRadius, 455, 0 + borderRadius)
    // this.drawLine(ctx, width - borderRadius, 5, 0 + borderRadius, 5)
    // this.drawLine(ctx, leftPosition, 100, rightPosition, 100)
    // this.drawLine(ctx, 300, 100, 300, 160)
    // this.drawLine(ctx, leftPosition, 160, rightPosition, 160)



    // const beginX = leftPosition
    // const beginY = 190
    // this.drawGroupText(ctx, order, beginX, beginY)

    // JsBarcode(`#barcode`, order.barcode, {
    //   format: "CODE128B",
    //   lineColor: "#000",
    //   width: 1,
    //   height: 40,
    //   displayValue: true,
    //   text: order.barcode,
    //   fontSize: 12,
    //   font: 'verdana, sans-serif',
    //   textMargin: 5
    // })
  }

  drawGroupText = (ctx, order, beginX, beginY) => {
    this.drawText(ctx, `ผู้รับ: ${order.reciver.name} T: ${order.reciver.phoneNumber}`, beginX, beginY, 14, 'bold')
    this.drawText(ctx, `${order.reciver.address}`, beginX, 210, 14, 'bold')

    this.drawText(ctx, `ผู้ส่ง: ${order.sender.name} T: ${order.sender.phoneNumber}`, beginX, 240, 13)
    this.drawText(ctx, `${order.sender.address}`, beginX, 260, 13)

    this.drawText(ctx, `${order.date}, (${order.type}), ${order.weight}`, beginX, 300, 13)

    this.drawText(ctx, `หมายเหตุ: ${order.eg}`, beginX, 330, 13)
    this.drawText(ctx, `หมายเหตุ: ${order.eg}`, beginX, 450, 13)

  }

  drawRact = (ctx, width, height, borderRadius) => {
    this.drawLine(ctx, 5, 0 + borderRadius, 5, height - borderRadius)
    // this.drawLine(ctx, 0 + borderRadius, 395, width - borderRadius, 395)
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
    return (
      <div
        style={{
          position: 'relative',
        }}
      >
        <canvas
          id={`barcode`}
          style={{ position: 'absolute', top: 20, left: 60 }}
        />
        <canvas ref={node => this.canvasRef = node} />
      </div>
    )
  }
}

export default OrderPreview
