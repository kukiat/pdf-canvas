import React, { Component } from 'react';
import JsBarcode from 'jsbarcode'
import Slider from "react-slick"

const getHeightText = (height) => {
  return height - (0.2 * height)
}

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
    this.left = 0
    this.right = 0
    this.position = 'left'
  }

  componentDidMount() {
    const ctx = this.canvasRef.getContext('2d')
    ctx.canvas.width = WIDTH
    ctx.canvas.height = HEIGHT
    this.props.orderList.forEach(order => {
      this.position = this.getPosition()
      const { startX, startY } = this.getStartXY(this.position)
      this.drawCanvas(ctx, order, startX, startY)
    })
  }

  getWidthInner() {
    return ((WIDTH - (PADDING * 2) - GAP) / 2)
  }

  getStartXY = (position) => {
    if (position === 'left') {
      return {
        startX: 0 + PADDING,
        startY: PADDING + this.left
      }
    }
    return {
      startX: 375 + PADDING,
      startY: PADDING + this.right
    }
  }

  setPosition = (position, size) => {
    this[position] = size
  }

  getPosition = () => {
    return this.left > this.right ? 'right' : 'left'
  }

  drawCanvas = (ctx, order, startX, startY) => {
    const padding = 10
    const width = this.getWidthInner()

    this.drawLine(ctx, startX, startY, startX + width, startY) //เส้นบน

    this.drawLine(
      ctx, startX +
      padding,
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
    // JsBarcode(`#barcode`, order.barcode, {
    //   format: "CODE128B",
    //   lineColor: "#000",
    //   width: 1,
    //   height: 40,
    //   displayValue: true,
    //   text: order.barcode,
    //   fontSize: 12,
    //   font: FONT_FAMILY,
    //   textMargin: 5
    // })
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

    const orderDetailsText = [`${order.date}, `, `${order.type}, `, `${order.weight}`, `${order.type}, `, ' xxxxxx', ' xxxxxx', ' xxxxxx', ' xxxxxx', ' xxxxxx']
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

    // const orderEgTextSize = 12
    // const orderEgFit = 18
    // const egDetails = this.splitLineText(ctx, `หมายเหตุ: ${order.eg}`, orderEgTextSize, orderEgFit, 'normal')
    // heightContent += orderDetails.height
    // this.drawTextGroup(ctx, {
    //   totalText: egDetails.newText,
    //   fit: orderEgFit,
    //   x: startXContent,
    //   y: heightContent + 20,
    //   size: orderEgTextSize,
    // })

    heightContent += orderDetails.height + paddingContentVertical
    this.setPosition(this.position, heightContent)
    const width = this.getWidthInner()
    this.drawLine(ctx, startX, startY, startX, heightContent) //เส้นซ้าย
    this.drawLine(ctx, startX + width, startY, startX + width, heightContent)
    this.drawLine(ctx, startX, heightContent, startX + width, heightContent)
  }

  splitLineText = (ctx, text, size, fit, weight) => {
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
    const height = newText.reduce((prev, curr) => {
      return prev + this.getWidthHeightText(ctx, size, curr, weight).height + fit
    }, 0)
    return { newText, height: height - fit }
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
        if (!totalText.length) {
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

  getWidthHeightText = (ctx, size, label, weight) => {
    ctx.font = `${weight} ${size}px ${FONT_FAMILY}`
    return {
      width: ctx.measureText(label).width,
      height: getHeightText(size),
    }
  }

  drawTextGroup(ctx, { fit, x, y, totalText, size, weight = 'normal' }) {
    totalText.forEach((text, index) => {
      const { height } = this.getWidthHeightText(ctx, size, text, weight)
      const margin = height + (index * fit)
      this.drawText(ctx, text, x, y + margin, size, weight)
    })
  }

  drawText = (ctx, label = '', x, y, size, weight = 'normal') => {
    ctx.font = `${weight} ${size}px ${FONT_FAMILY}`
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
      <div>
        <canvas ref={node => this.canvasRef = node} />
      </div>
    )
  }
}

export default OrderPreview
