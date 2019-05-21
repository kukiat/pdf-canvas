import React, { Component } from 'react'
import CanvasLogic from './CanvasLogic'
import JsBarcode from 'jsbarcode'
import qr from 'qrcode'
import { isEmpty } from 'lodash'
import { getHeigthFromRatio } from '../../libs/utils'

const WIDTH = 670
// const HEIGHT = getHeigthFromRatio('a4')(WIDTH)
const HEIGHT = 3000
const PADDING = 10
const GAP = 10
const FONT_FAMILY = 'verdana, sans-serif'

const barcodeAreaHeight = 100
const qrcodeAreaWidth = 88
const headerAreaHeigth = 60

const paddingContentHorizontal = 10
const paddingContentVertical = 15

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
    const line1 = this.canvasLogic.getPositionDetails(order.id, 'line1')
    this.drawLine(ctx, line1)

    const line2 = this.canvasLogic.getPositionDetails(order.id, 'line2')
    this.drawLine(ctx, line2)

    const line3 = this.canvasLogic.getPositionDetails(order.id, 'line3')
    this.drawLine(ctx, line3)

    const orderName = this.canvasLogic.getPositionDetails(order.id, 'orderName')
    this.drawText(ctx, orderName)

    const orderId = this.canvasLogic.getPositionDetails(order.id, 'orderId')
    this.drawText(ctx, orderId)

    const orderPage = this.canvasLogic.getPositionDetails(order.id, 'orderPage')
    this.drawText(ctx, orderPage)

    const reciverName = this.canvasLogic.getPositionDetails(order.id, 'reciverName')
    this.drawTextGroup(ctx, reciverName)

    const reciverAddress = this.canvasLogic.getPositionDetails(order.id, 'reciverAddress')
    this.drawTextGroup(ctx, reciverAddress)

    const senderName = this.canvasLogic.getPositionDetails(order.id, 'senderName')
    this.drawTextGroup(ctx, senderName)

    const senderAddress = this.canvasLogic.getPositionDetails(order.id, 'senderAddress')
    this.drawTextGroup(ctx, senderAddress)

    const orderDetails = this.canvasLogic.getPositionDetails(order.id, 'orderDetails')
    this.drawTextGroup(ctx, orderDetails)

    const orderEg = this.canvasLogic.getPositionDetails(order.id, 'orderEg')
    this.drawTextGroup(ctx, orderEg)

    const lineTop = this.canvasLogic.getPositionDetails(order.id, 'lineTop')
    this.drawLine(ctx, lineTop)

    const lineBottom = this.canvasLogic.getPositionDetails(order.id, 'lineBottom')
    this.drawLine(ctx, lineBottom)

    const lineLeft = this.canvasLogic.getPositionDetails(order.id, 'lineLeft')
    this.drawLine(ctx, lineLeft)

    const lineRight = this.canvasLogic.getPositionDetails(order.id, 'lineRight')
    this.drawLine(ctx, lineRight)
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
