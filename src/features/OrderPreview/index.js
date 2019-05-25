import React, { Component } from 'react'
import JsBarcode from 'jsbarcode'
import qr from 'qrcode'
import CanvasLogic from '../canvas/CanvasLogic'
import {
  FONT_FAMILY,
  GAP,
  PADDING,
  WIDTH,
  QRCODE_WIDTH
} from '../canvas/config'

class OrderPreview extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = null
    this.canvasLogic = new CanvasLogic(WIDTH, PADDING, GAP)
  }

  componentDidMount() {
    this.draw()
  }

  initCanvas(el, width, height) {
    const canvas = document.createElement('canvas')
    el.appendChild(canvas)
    const ctx = canvas.getContext('2d')
    ctx.canvas.width = width
    ctx.canvas.height = height
    return ctx
  }

  draw() {
    this.canvasLogic.calculate(this.props.orderList)
    const { width, height } = this.canvasLogic.getPageSize()
    const ctx = this.initCanvas(this.div, width, height)

    this.props.orderList.forEach(order => {
      this.drawOrder(ctx, order)
      this.drawBarcode(order)
      this.drawQrcode(order)
    })
  }

  drawQrcode(order) {
    const { x, y } = this.canvasLogic.getPosition(order.id)['checkpointQr']
    const options = {
      errorCorrectionLevel: 'H',
      width: QRCODE_WIDTH
    }

    qr.toCanvas(order.sender.phoneNumber, options, (err, canvas) => {
      if (err) throw err
      canvas.style = `position:absolute;margin-top:${y}px;margin-left:${x}px`
      this.div.insertBefore(canvas, this.div.lastChild)
    })
  }

  drawBarcode(order) {
    const { x, y } = this.canvasLogic.getPosition(order.id)['checkpointBarcode']

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
