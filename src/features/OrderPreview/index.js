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
    this.initCanvas()
    this.props.orderList.forEach(order => {
      const { startX, startY } = this.canvasLogic.getCurrentPosition()
      console.log(startX, startY)
      // if (startY > HEIGHT) {
      //   // this.initCanvas()
      //   // this.recalculate()
      // }
      this.drawOrder(this.ctx, order, startX, startY)
      this.drawBarcode(order, startX, startY)
      this.drawQrcode(order)
    })
    console.log(this.canvasLogic.possition)
  }

  drawQrcode(order) {
    const { x, y } = this.canvasLogic.getCheckPointQr(qrcodeAreaWidth)
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

  drawBarcode(order, startX, startY) {
    const { x, y } = this.convertPositionBarCode(startX, startY)

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

  drawOrder(ctx, order, startX, startY) {
    const padding = 10
    const width = this.getWidthInner()

    // this.canvasLogic.setPosition(order.id, {
    //   line1: {
    //     startX: startX + padding,
    //     startY: startY + barcodeAreaHeight,
    //     endX: startX + width - padding,
    //     endY: startY + barcodeAreaHeight,
    //   }
    // })

    this.drawLine(ctx,
      startX + padding,
      startY + barcodeAreaHeight,
      startX + width - padding,
      startY + barcodeAreaHeight
    )
    // this.canvasLogic.updatePosition(order.id, {
    //   line2: {
    //     startX: startX + padding,
    //     startY: startY + barcodeAreaHeight + headerAreaHeigth,
    //     endX: startX + width - padding,
    //     endY: startY + barcodeAreaHeight + headerAreaHeigth
    //   }
    // })
    this.drawLine(
      ctx,
      startX + padding,
      startY + barcodeAreaHeight + headerAreaHeigth,
      startX + width - padding,
      startY + barcodeAreaHeight + headerAreaHeigth
    )
    const leftAreaHeader = Math.floor(0.65 * width)
    const rightAreaHeader = width - leftAreaHeader
    // this.canvasLogic.updatePosition(order.id, {
    //   leftAreaHeader,
    //   rightAreaHeader,
    //   line3: {
    //     startX: startX + padding,
    //     startY: startY + barcodeAreaHeight + headerAreaHeigth,
    //     endX: startX + width - padding,
    //     endY: startY + barcodeAreaHeight + headerAreaHeigth
    //   }
    // })
    this.drawLine(
      ctx,
      startX + leftAreaHeader,
      startY + barcodeAreaHeight,
      startX + leftAreaHeader,
      startY + barcodeAreaHeight + headerAreaHeigth
    )

    const fontSizeOrderName = 22
    const fontSizeTextOrderName = this.getWidthHeightText(ctx, fontSizeOrderName, order.orderName, 'bold')
    const paddingVerticalOrderName = barcodeAreaHeight + fontSizeTextOrderName.height + ((headerAreaHeigth - fontSizeTextOrderName.height) / 2)
    const paddingHorizontalOrderName = ((leftAreaHeader - padding - fontSizeTextOrderName.width) / 2)
    this.drawText(
      ctx,
      order.orderName,
      startX + padding + paddingHorizontalOrderName,
      startY + paddingVerticalOrderName,
      fontSizeOrderName,
      'bold'
    )

    const fontSizeOrderId = 16
    const fontSizeTextOrderId = this.getWidthHeightText(ctx, fontSizeOrderId, order.orderId, 'bold')
    const paddingVerticalOrderIdText = ((headerAreaHeigth / 2) - fontSizeTextOrderId.height) / 2
    const paddingHorizontalOrderId = (rightAreaHeader - padding - fontSizeTextOrderId.width) / 2
    this.drawText(
      ctx,
      order.orderId,
      startX + leftAreaHeader + paddingHorizontalOrderId,
      startY + barcodeAreaHeight + fontSizeTextOrderId.height + paddingVerticalOrderIdText,
      fontSizeOrderId,
      'bold'
    )

    const fontSizeOrderPage = 14
    const orderPageText = `${Number(order.id) + 1} of ${this.props.orderList.length}`
    const fontSizeTextOrderPage = this.getWidthHeightText(ctx, fontSizeOrderPage, orderPageText, 'normal')
    const paddingVerticalOrderPageText = ((headerAreaHeigth / 2) - fontSizeTextOrderPage.height) / 2
    const paddingHorizontalOrderPage = (rightAreaHeader - padding - fontSizeTextOrderPage.width) / 2
    this.drawText(
      ctx,
      orderPageText,
      startX + leftAreaHeader + paddingHorizontalOrderPage,
      startY + barcodeAreaHeight + fontSizeTextOrderPage.height + paddingVerticalOrderPageText + (headerAreaHeigth / 2),
      fontSizeOrderPage,
      'normal'
    )

    this.drawContent(ctx, order, startX, startY)
  }

  drawContent(ctx, order, startX, startY) {
    const startXContent = startX + paddingContentHorizontal
    const startYContent = startY + barcodeAreaHeight + headerAreaHeigth
    let heightContent = startYContent

    const reciverNameText = [`ผู้รับ: ${order.reciver.name} `, `T: ${order.reciver.phoneNumber}`]
    const reciverNameSizeText = 12
    const reciverNameFit = 20
    const reciverNameDetails = this.getDetailsTextGroup(ctx, reciverNameText, reciverNameSizeText, 'bold', reciverNameFit)
    heightContent += paddingContentVertical
    this.drawTextGroup(ctx, {
      ...reciverNameDetails,
      fit: reciverNameFit,
      x: startXContent,
      y: heightContent,
      size: reciverNameSizeText,
      weight: 'bold'
    })

    const reciverAddressText = order.reciver.address.split(' ')
    const reciverAddressSizeText = 12
    const reciverAddressFit = 18
    const reciverAddressDetails = this.getDetailsTextGroup(ctx, reciverAddressText, reciverAddressSizeText, 'bold', reciverAddressFit)
    heightContent += reciverNameDetails.height + 10
    this.drawTextGroup(ctx, {
      ...reciverAddressDetails,
      fit: reciverAddressFit,
      x: startXContent,
      y: heightContent,
      size: reciverAddressSizeText,
      weight: 'bold'
    })


    const senderNameText = [`ผู้ส่ง: ${order.reciver.name} `, `T: ${order.reciver.phoneNumber}`]
    const senderNameSizeText = 10
    const senderNameFit = 16
    const senderNameDetails = this.getDetailsTextGroup(ctx, senderNameText, senderNameSizeText, 'normal', senderNameFit, qrcodeAreaWidth)
    heightContent += reciverAddressDetails.height + 20
    this.drawTextGroup(ctx, {
      ...senderNameDetails,
      fit: senderNameFit,
      x: startXContent,
      y: heightContent,
      size: senderNameSizeText,
    })

    this.canvasLogic.setCheckPointQr(heightContent - 10)

    const senderAddressText = order.sender.address.split(' ')
    const senderAddressSizeText = 10
    const senderAddressFit = 16
    const senderAddressDetails = this.getDetailsTextGroup(ctx, senderAddressText, senderAddressSizeText, 'normal', senderAddressFit, qrcodeAreaWidth)
    heightContent += senderNameDetails.height + 10
    this.drawTextGroup(ctx, {
      ...senderAddressDetails,
      fit: senderAddressFit,
      x: startXContent,
      y: heightContent,
      size: senderAddressSizeText,
    })

    const orderDetailsText = [`${order.date}, `, `${order.type}, `, `${order.weight}`]
    const orderDetailsTextSize = 10
    const orderDetailsFit = 16
    const orderDetails = this.getDetailsTextGroup(ctx, orderDetailsText, orderDetailsTextSize, 'normal', orderDetailsFit, qrcodeAreaWidth)
    heightContent += senderAddressDetails.height + 20
    this.drawTextGroup(ctx, {
      ...orderDetails,
      fit: orderDetailsFit,
      x: startXContent,
      y: heightContent,
      size: orderDetailsTextSize,
    })

    const orderEgTextSize = 10
    const orderEgFit = 16
    const textArr = this.splitLineText(ctx, `หมายเหตุ: ${order.eg}`, orderEgTextSize, orderEgFit, 'normal')
    const egDetails = this.getDetailsTextGroup(ctx, textArr, orderEgTextSize, 'normal', orderEgFit)
    heightContent += orderDetails.height + 20
    this.drawTextGroup(ctx, {
      ...egDetails,
      fit: orderEgFit,
      x: startXContent,
      y: heightContent,
      size: orderEgTextSize,
    })

    heightContent += egDetails.height + paddingContentVertical

    this.canvasLogic.setCurrentSizePosition(heightContent)

    const width = this.getWidthInner()
    this.drawLine(ctx, startX, startY, startX + width, startY)
    this.drawLine(ctx, startX, startY, startX, heightContent)
    this.drawLine(ctx, startX + width, startY, startX + width, heightContent)
    this.drawLine(ctx, startX, heightContent, startX + width, heightContent)
  }

  splitLineText(ctx, text, size, fit, weight) {
    const maxWidth = (WIDTH / 2) - (PADDING * 2) - (paddingContentHorizontal * 2)
    let newText = ['']
    let eachWidth = 0
    let currectLine = 0
    for (let word of text) {
      const { width } = this.getWidthHeightText(ctx, size, word, weight)
      eachWidth += width
      newText[currectLine] += word
      if (eachWidth > maxWidth) {
        eachWidth = 0
        currectLine += 1
        newText.push('')
      }
    }

    return newText
  }

  getDetailsTextGroup(ctx, textArr, size, weight, fit = 0, areaWidth = 0) {
    const maxWidth = ((WIDTH - (PADDING * 2) - GAP) / 2) - (paddingContentHorizontal * 2) - areaWidth

    let widthTemp = 0
    let totalText = []
    let totalHeight = 0
    textArr.forEach((text) => {
      const { width, height } = this.getWidthHeightText(ctx, size, text, weight)
      widthTemp += width
      if (widthTemp > maxWidth) {
        totalHeight += fit
        totalText.push(text)
        widthTemp = width
      } else {
        if (isEmpty(totalText)) {
          totalHeight += height
          totalText.push(text)
        } else {
          totalText[totalText.length - 1] += text
        }
      }
    })
    return {
      line: totalText.length,
      totalText,
      width: maxWidth,
      height: totalHeight
    }
  }

  getWidthInner() {
    return ((WIDTH - (PADDING * 2) - GAP) / 2)
  }

  convertPositionBarCode(x, y) {
    const width = this.getWidthInner()
    return {
      x: (width - 242) / 2 + x,
      y: (barcodeAreaHeight - 72) / 2 + y
    }
  }

  getWidthHeightText(ctx, size, label, weight) {
    ctx.font = `${weight} ${size}px ${FONT_FAMILY}`
    return {
      width: ctx.measureText(label).width,
      height: this.getHeightText(size),
    }
  }

  getHeightText(height) {
    return height - (0.2 * height)
  }

  drawTextGroup(ctx, { fit, x, y, totalText, size, weight = 'normal' }) {
    totalText.forEach((text, index) => {
      const { height } = this.getWidthHeightText(ctx, size, text, weight)
      const margin = height + (index * fit)
      this.drawText(ctx, text, x, y + margin, size, weight)
    })
  }

  drawText(ctx, label = '', x, y, size, weight = 'normal') {
    ctx.font = `${weight} ${size}px ${FONT_FAMILY}`
    ctx.fillText(label, x, y)
  }

  drawLine(ctx, moveToX, moveToY, lineToX, lineToY) {
    ctx.beginPath()
    ctx.strokeStyle = "#000"
    ctx.lineWidth = 1
    ctx.moveTo(moveToX, moveToY)
    ctx.lineTo(lineToX, lineToY)
    ctx.stroke()
  }

  render() {
    return (
      <div ref={node => this.div = node} />
    )
  }
}

export default OrderPreview
