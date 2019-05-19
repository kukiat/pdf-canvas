import React, { Component } from 'react';
import RenderCanvas from './RenderCanvas'
import JsBarcode from 'jsbarcode'
import { isEmpty } from 'lodash'

const WIDTH = 760
const HEIGHT = 4000
const PADDING = 10
const GAP = 10
const FONT_FAMILY = 'verdana, sans-serif'

const barcodeAreaHeight = 100
const headerAreaHeigth = 60

const paddingContentHorizontal = 10
const paddingContentVertical = 15

class OrderPreview extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = null
    this.renderCanvas = new RenderCanvas(this.props.orderList, WIDTH, HEIGHT, PADDING, GAP)
  }

  componentDidMount() {
    const canvasRef = this.canvasRef
    const ctx = canvasRef.getContext('2d')
    ctx.canvas.width = WIDTH
    ctx.canvas.height = HEIGHT
    this.props.orderList.forEach(order => {
      const { startX, startY } = this.renderCanvas.initPosition(order.id)
      const cas = this.renderCanvas.getCurrentPosition(order.id)
      console.log(cas)
      this.drawBarcode(order, cas.startX, cas.startY)
      this.drawCanvas(ctx, order, startX, startY)
    })
  }

  convertPositionBarCode(x, y) {
    const width = this.getWidthInner()
    return {
      x: (width - 242) / 2 + x,
      y: (barcodeAreaHeight - 72) / 2 + y
    }
  }

  drawBarcode(order, startX, startY) {
    const canvas = document.createElement('canvas')
    const { x, y } = this.convertPositionBarCode(startX, startY)
    canvas.setAttribute('id', `barcode${order.id}`)
    canvas.style = `position:absolute;margin-top:${y}px;margin-left:${x}px`
    this.div.insertBefore(canvas, this.canvasRef)

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

  getWidthInner() {
    return ((WIDTH - (PADDING * 2) - GAP) / 2)
  }

  drawCanvas(ctx, order, startX, startY) {
    const padding = 10
    const width = this.getWidthInner()

    this.drawLine(ctx,
      startX + padding,
      startY + barcodeAreaHeight,
      startX + width - padding,
      startY + barcodeAreaHeight
    )
    this.drawLine(
      ctx,
      startX + padding,
      startY + barcodeAreaHeight + headerAreaHeigth,
      startX + width - padding,
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

    const fontSizeOrderName = 26
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

    const fontSizeOrderId = 20
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

    const fontSizeOrderPage = 16
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
    const qrcodeAreaWidth = 88
    const startXContent = startX + paddingContentHorizontal
    const startYContent = startY + barcodeAreaHeight + headerAreaHeigth
    let heightContent = startYContent

    const reciverNameText = [`ผู้รับ: ${order.reciver.name}`, `T: ${order.reciver.phoneNumber}`]
    const reciverNameSizeText = 14
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
    const reciverAddressSizeText = 14
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
    const senderNameSizeText = 12
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

    const senderAddressText = order.sender.address.split(' ')
    const senderAddressSizeText = 12
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

    const orderDetailsText = [`${order.date}, `, `${order.type}, `, `${order.weight}`, `${order.type}`]
    const orderDetailsTextSize = 12
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

    const orderEgTextSize = 12
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

    this.renderCanvas.setCurrentSizePosition(heightContent)

    const width = this.getWidthInner()
    this.drawLine(ctx, startX, startY, startX + width, startY)
    this.drawLine(ctx, startX, startY, startX, heightContent)
    this.drawLine(ctx, startX + width, startY, startX + width, heightContent)
    this.drawLine(ctx, startX, heightContent, startX + width, heightContent)
  }

  splitLineText(ctx, text, size, fit, weight) {
    const maxWidth = 340
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
      <div style={{ backgroundColor: '#fff', position: 'relative' }} ref={node => this.div = node}>
        <canvas ref={node => this.canvasRef = node} />
      </div>
    )
  }
}

export default OrderPreview
