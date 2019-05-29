import JsBarcode from 'jsbarcode'
import qr from 'qrcode'
import { FONT_FAMILY, QRCODE_WIDTH } from './config'
import { getWidthHeightText } from '../../libs/utils'

class CanvasRenderer {
  constructor() {
    this.ctx = null
    this.div = null
  }

  init(el, width, height) {
    this.div = el
    const canvas = document.createElement('canvas')
    el.appendChild(canvas)
    this.ctx = canvas.getContext('2d')
    this.ctx.canvas.width = width
    this.ctx.canvas.height = height
  }

  drawQrcode(position, order) {
    const { x, y } = position['checkpointQr']
    const options = {
      errorCorrectionLevel: 'H',
      width: QRCODE_WIDTH
    }

    qr.toCanvas(order.sender.phoneNumber, options, (err, canvas) => {
      if (err) throw err
      this.ctx.drawImage(canvas, x, y)
    })
  }

  drawBarcode(position, order) {
    const { x, y } = position['checkpointBarcode']

    const canvas = document.createElement('canvas')
    JsBarcode(canvas, order.barcode, {
      format: 'CODE128B',
      lineColor: '#000',
      width: 1.3,
      height: 40,
      displayValue: true,
      text: order.barcode,
      fontSize: 14,
      font: FONT_FAMILY,
      textMargin: 7
    })
    this.ctx.drawImage(canvas, x, y, 242, 72)
  }

  drawTextGroup(ctx, { fit, x, y, totalText, size, weight = 'normal' }) {
    totalText.forEach((label, index) => {
      const { height } = getWidthHeightText(size, label, weight)
      const margin = height + index * fit
      this.drawText(ctx, { label, x, y: y + margin, size, weight })
    })
  }

  drawText(ctx, { label = '', x, y, size, weight = 'normal' }) {
    ctx.font = `${weight} ${size}px ${FONT_FAMILY}`
    ctx.fillText(label, x, y)
  }

  drawLine(ctx, { startX, startY, endX, endY }) {
    ctx.beginPath()
    ctx.strokeStyle = '#000'
    ctx.lineWidth = 1
    ctx.moveTo(startX, startY)
    ctx.lineTo(endX, endY)
    ctx.stroke()
  }

  drawContent(position) {
    const ctx = this.ctx

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
}

export default CanvasRenderer
