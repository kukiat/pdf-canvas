import React, { Component } from 'react';
import JsBarcode from 'jsbarcode'

function getHeightText(height) {
  return height - (0.2 * height)
}

const WIDTH = 760
const HEIGHT = 900
const PADDING = 10
const GAP = 10
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
    const localPadding = 10
    const width = ((WIDTH - (PADDING * 2) - GAP) / 2)
    const startX = 0 + PADDING
    const startY = 0 + PADDING

    console.log(`(${startX},${startY})`)
    const ctx = this.canvasRef.getContext('2d')
    ctx.canvas.width = WIDTH
    ctx.canvas.height = HEIGHT

    this.drawLine(ctx, startX, startY, startX + width, startY) //เส้นบน
    this.drawLine(ctx, startX, startY, startX, 500) //เส้นซ้าย
    this.drawLine(ctx, startX + width, startY, startX + width, 500) //เส้นขวา


    const barcodeAreaHeight = 100
    const headerAreaHeigth = 60
    this.drawLine(
      ctx, startX +
      localPadding,
      startY + barcodeAreaHeight,
      startX + width - localPadding,
      startY + barcodeAreaHeight
    )
    this.drawLine(
      ctx,
      startX + localPadding,
      startY + barcodeAreaHeight + headerAreaHeigth,
      startX + width - localPadding,
      startY + barcodeAreaHeight + headerAreaHeigth
    )
    const leftAreaHeader = Math.floor(0.65 * width)
    const rightAreaHeader = width - leftAreaHeader
    this.drawLine(
      ctx,
      startX + leftAreaHeader,
      startY + barcodeAreaHeight,
      startX + leftAreaHeader,
      startY + barcodeAreaHeight + headerAreaHeigth
    )

    const fontSizeOrderName = 24
    const heightText = getHeightText(fontSizeOrderName)
    const offsetYOrderName = barcodeAreaHeight + heightText + ((headerAreaHeigth - heightText) / 2)
    ctx.font = `bold ${fontSizeOrderName}px verdana, sans-serif`
    const offsetXOrderName = ((leftAreaHeader - ctx.measureText(order.orderName).width) / 2)
    this.drawText(
      ctx,
      order.orderName,
      offsetXOrderName + startX,
      offsetYOrderName + startY,
      fontSizeOrderName,
      'bold'
    )

    const fontSizeOrderId = 20
    const heightOrderIdText = getHeightText(fontSizeOrderId)
    const paddingVerticalOrderIdText = ((headerAreaHeigth / 2) - heightOrderIdText) / 2
    ctx.font = `bold ${fontSizeOrderId}px verdana, sans-serif`
    const offsetXOrderId = startX + leftAreaHeader
    const paddingTextOrderId = (rightAreaHeader - localPadding - ctx.measureText(order.orderId).width) / 2
    this.drawText(
      ctx,
      order.orderId,
      offsetXOrderId + paddingTextOrderId,
      startY + barcodeAreaHeight + heightOrderIdText + paddingVerticalOrderIdText,
      fontSizeOrderId,
      'bold'
    )

    const fontSizeOrderPage = 16
    const heightOrderPageText = getHeightText(fontSizeOrderPage)
    const paddingVerticalOrderPageText = ((headerAreaHeigth / 2) - heightOrderPageText) / 2
    const orderPageText = `1 of 1`
    ctx.font = `normal ${fontSizeOrderPage}px verdana, sans-serif`
    const offsetXOrderPage = startX + leftAreaHeader
    const paddingTextOrderPage = (rightAreaHeader - localPadding - ctx.measureText(orderPageText).width) / 2
    this.drawText(
      ctx,
      orderPageText,
      offsetXOrderPage + paddingTextOrderPage,
      startY + barcodeAreaHeight + heightOrderPageText + paddingVerticalOrderPageText + (headerAreaHeigth / 2),
      fontSizeOrderPage,
      'normal'
    )

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
