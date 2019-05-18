import React, { Component } from 'react';
import JsBarcode from 'jsbarcode'
import Slider from "react-slick"

const getHeightText = (height) => {
  return height - (0.2 * height)
}

const WIDTH = 760
const HEIGHT = 900
const PADDING = 10
const GAP = 10
const FONT_FAMILY = 'verdana, sans-serif'

const startX = 0 + PADDING
const startY = 0 + PADDING
const barcodeAreaHeight = 100
const headerAreaHeigth = 60

const paddingContentHorizontal = 10
const paddingContentVertical = 15
class OrderPreview extends Component {
  constructor(props) {
    super(props)
    this.canvasRef = null
  }

  componentDidMount() {
    this.drawCanvas()
  }

  drawCanvas = () => {
    const order = this.props.orderList[0]
    const padding = 10
    const width = ((WIDTH - (PADDING * 2) - GAP) / 2)

    console.log(`(${startX},${startY})`)
    const ctx = this.canvasRef.getContext('2d')
    ctx.canvas.width = WIDTH
    ctx.canvas.height = HEIGHT

    this.drawLine(ctx, startX, startY, startX + width, startY) //เส้นบน
    this.drawLine(ctx, startX, startY, startX, 500) //เส้นซ้าย
    this.drawLine(ctx, startX + width, startY, startX + width, 500) //เส้นขวา

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
    const orderPageText = `1 of ${this.props.orderList.length}`
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

    this.drawContent(ctx, order)
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

  drawContent(ctx, order) {
    const startXContent = startX + paddingContentHorizontal
    const startYContent = startY + barcodeAreaHeight + headerAreaHeigth

    const texts = [`ผู้รับ: ${order.reciver.name}`, `T: ${order.reciver.phoneNumber}`]
    const reciverNameSizeText = 14
    const reciverNameFit = 20
    const reciverNameDetails = this.getDetailsTextGroup(ctx, texts, reciverNameSizeText, 'bold', reciverNameFit)
    this.drawTextGroup(ctx, {
      ...reciverNameDetails,
      fit: reciverNameFit,
      x: startXContent,
      y: startYContent + paddingContentVertical,
      size: reciverNameSizeText,
    })
  }

  getDetailsTextGroup(ctx, textArr, size, weight, fit = 0) {
    const maxWidth = ((WIDTH - (PADDING * 2) - GAP) / 2) - (paddingContentHorizontal * 2)
    let widthTemp = 0
    let totalText = []
    let totalHeight = 0
    textArr.forEach((text) => {
      ctx.font = `${weight} ${size}px ${FONT_FAMILY}`
      const { width, height } = this.getWidthHeightText(ctx, size, text, weight)
      widthTemp += width

      if (widthTemp > maxWidth) {
        totalHeight = height + fit
        totalText.push(text)
        widthTemp -= maxWidth
      } else {
        if (!totalText.length) {
          totalHeight += height
          totalText.push(text)
        } else {
          totalText[totalText.length - 1] = totalText[totalText.length - 1] + ' ' + text
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

  drawTextGroup(ctx, { fit, x, y, totalText, size }) {
    totalText.forEach((text, index) => {
      const { height } = this.getWidthHeightText(ctx, size, text, 'bold')
      const margin = height + (index * fit)
      this.drawText(ctx, text, x, y + margin, size, 'bold')
    })
  }

  getWidthHeightText = (ctx, size, label, weight) => {
    const text = `${weight} ${size}px ${FONT_FAMILY}`
    ctx.font = text
    return {
      width: ctx.measureText(label).width,
      height: getHeightText(size),
    }
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
