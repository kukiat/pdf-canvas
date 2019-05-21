import React, { Component } from 'react'
import CanvasLogic from './CanvasLogic'
import JsBarcode from 'jsbarcode'
import qr from 'qrcode'
import { getHeigthFromRatio } from '../../libs/utils'

const WIDTH = 670
// const HEIGHT = getHeigthFromRatio('a4')(WIDTH)
const HEIGHT = 3000
const PADDING = 10
const GAP = 10
const FONT_FAMILY = 'verdana, sans-serif'

const qrcodeAreaWidth = 88


class OrderPreview extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = null
    this.canvasLogic = new CanvasLogic(WIDTH, HEIGHT, PADDING, GAP)
  }

  componentDidMount() {
    this.draw()
  }

  initCanvas() {
    const canvas = document.createElement('canvas')
    this.div.appendChild(canvas)
    this.ctx = canvas.getContext('2d')
    this.ctx.canvas.width = WIDTH
    this.ctx.canvas.height = HEIGHT
  }

  draw() {
    this.canvasLogic.calculate(this.props.orderList)
    this.initCanvas()
    this.props.orderList.forEach(order => {
      this.drawOrder(this.ctx, order)
      this.drawBarcode(order)
      this.drawQrcode(order)
    })
  }

  drawQrcode(order) {
    const { x, y } = this.canvasLogic.getPositionDetails(order.id, 'checkpointQr')
    const options = {
      errorCorrectionLevel: 'H',
      width: qrcodeAreaWidth
    }
    qr.toCanvas(order.sender.phoneNumber, options, (err, canvas) => {
      if (err) throw err
      canvas.style = `position:absolute;margin-top:${y}px;margin-left:${x}px`
      this.div.insertBefore(canvas, this.div.lastChild)
    })
  }

  drawBarcode(order) {
    const { x, y } = this.canvasLogic.getPositionDetails(order.id, 'checkpointBarcode')

    const canvas = document.createElement('canvas')
    canvas.setAttribute('id', `barcode${order.id}`)
    canvas.style = `position:absolute;margin-top:${y}px;margin-left:${x}px`
    this.div.insertBefore(canvas, this.div.lastChild)

    JsBarcode(`#barcode${order.id}`, order.barcode, {
      format: "CODE128B",
      lineColor: "#000",
      width: 1,
      height: 35,
      displayValue: true,
      text: order.barcode,
      fontSize: 12,
      font: FONT_FAMILY,
      textMargin: 5
    })
  }

  drawOrder(ctx, order) {
    const position = this.canvasLogic.getPosition(order.id)

    this.drawLine(ctx, position['line1'])
    this.drawLine(ctx, position['line2'])
    this.drawLine(ctx, position['line3'])

    this.drawText(ctx, position['orderName'])
    this.drawText(ctx, position['orderId'])
    this.drawText(ctx, position['orderPage'])

    this.drawTextGroup(ctx, position['reciverName'])
    this.drawTextGroup(ctx, position['reciverAddress'])

    this.drawTextGroup(ctx, position['senderName'])
    this.drawTextGroup(ctx, position['senderAddress'])

    this.drawTextGroup(ctx, position['orderDetails'])

    this.drawTextGroup(ctx, position['orderEg'])

    this.drawLine(ctx, position['lineTop'])
    this.drawLine(ctx, position['lineRight'])
    this.drawLine(ctx, position['lineLeft'])
    this.drawLine(ctx, position['lineBottom'])


  }

  drawTextGroup(ctx, { fit, x, y, totalText, size, weight = 'normal' }) {
    totalText.forEach((label, index) => {
      const { height } = this.canvasLogic.getWidthHeightText(size, label, weight)
      const margin = height + (index * fit)
      this.drawText(ctx, { label, x, y: y + margin, size, weight })
    })
  }

  drawText(ctx, { label = '', x, y, size, weight = 'normal' }) {
    ctx.font = `${weight} ${size}px ${FONT_FAMILY}`
    ctx.fillText(label, x, y)
  }

  drawLine(ctx, { startX, startY, endX, endY }) {
    ctx.beginPath()
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  }

  render() {
    return (
      <div ref={node => this.div = node} />
    )
  }
}

export default OrderPreview
