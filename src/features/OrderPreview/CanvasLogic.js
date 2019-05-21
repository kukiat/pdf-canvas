import { isEmpty } from 'lodash'

const FONT_FAMILY = 'verdana, sans-serif'
const paddingContentHorizontal = 10
const paddingContentVertical = 15

const barcodeAreaHeight = 100
const qrcodeAreaWidth = 88
const headerAreaHeigth = 60
class CanvasLogic {
  constructor(width, height, padding, gap) {
    this.position = new Map()
    this.width = width
    this.height = height
    this.padding = padding
    this.gap = gap
    this.left = 0
    this.right = 0
    this.currentSide = 'left'
  }

  changePosition() {
    if (this.left > this.right) {
      this.currentSide = 'right'
    } else {
      this.currentSide = 'left'
    }
  }

  setCurrentSizePosition(size) {
    this[this.currentSide] = size
  }

  getCurrentPosition() {
    this.changePosition()
    if (this.currentSide === 'left') {
      return {
        startX: 0 + this.padding,
        startY: this.padding + this.left
      }
    }
    const area = (this.width - this.gap) / 2
    return {
      startX: area + this.padding,
      startY: this.padding + this.right
    }
  }

  convertPositionBarCode(x, y) {
    const width = this.getWidthInner()
    return {
      x: (width - 242) / 2 + x,
      y: (barcodeAreaHeight - 72) / 2 + y
    }
  }

  getCheckPointQr(currentHeight) {
    const area = this.currentSide === 'left' ? this.width / 2 : this.width
    return {
      x: area - (qrcodeAreaWidth + this.gap + this.padding),
      y: currentHeight
    }
  }
  updatePosition(id, data) {
    const currentData = this.position.get(id)
    this.setPosition(id, {
      ...currentData,
      ...data
    })
  }

  getWidthInner() {
    return ((this.width - (this.padding * 2) - this.gap) / 2)
  }

  sortPage() {
    //10 10 | 340 10
    let newPosition = []
    this.position.forEach(p => {
      console.log(p)
    })
  }

  setPosition(id, data) {
    this.position.set(id, {
      side: this.currentSide,
      ...data
    })
  }

  getPosition(id) {
    return this.position.get(id)
  }

  getPositionDetails(id, key) {
    return this.position.get(id)[key]
  }

  getHeightText(height) {
    return height - (0.2 * height)
  }

  getWidthHeightText(size, label, weight) {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')

    ctx.font = `${weight} ${size}px ${FONT_FAMILY}`
    const width = ctx.measureText(label).width
    canvas.remove()
    return {
      width,
      height: this.getHeightText(size),
    }
  }

  getDetailsTextGroup(textArr, size, weight, fit = 0, areaWidth = 0) {
    const maxWidth = ((this.width - (this.padding * 2) - this.gap) / 2) - (paddingContentHorizontal * 2) - areaWidth
    let widthTemp = 0
    let totalText = []
    let totalHeight = 0
    textArr.forEach((text) => {
      const { width, height } = this.getWidthHeightText(size, text, weight)
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

  splitLineText(text, size, fit, weight) {
    const maxWidth = (this.width / 2) - (this.padding * 2) - (paddingContentHorizontal * 2)
    let newText = ['']
    let eachWidth = 0
    let currectLine = 0
    for (let word of text) {
      const { width } = this.getWidthHeightText(size, word, weight)
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

  calculate(orderList) {
    orderList.forEach(order => {
      const { startX, startY } = this.getCurrentPosition()
      this.calculateItem(order, { startX, startY }, orderList)
    })
  }

  calculateItem(order, { startX, startY }, orderList) {
    const padding = 10
    const width = this.getWidthInner()

    const leftAreaHeader = Math.floor(0.65 * width)
    const rightAreaHeader = width - leftAreaHeader
    this.setPosition(order.id, { startX, startY })

    this.updatePosition(order.id, {
      line1: {
        startX: startX + padding,
        startY: startY + barcodeAreaHeight,
        endX: startX + width - padding,
        endY: startY + barcodeAreaHeight,
      }
    })

    this.updatePosition(order.id, {
      line2: {
        startX: startX + padding,
        startY: startY + barcodeAreaHeight + headerAreaHeigth,
        endX: startX + width - padding,
        endY: startY + barcodeAreaHeight + headerAreaHeigth
      }
    })

    this.updatePosition(order.id, {
      leftAreaHeader,
      rightAreaHeader,
      line3: {
        startX: startX + leftAreaHeader,
        startY: startY + barcodeAreaHeight,
        endX: startX + leftAreaHeader,
        endY: startY + barcodeAreaHeight + headerAreaHeigth
      }
    })

    const fontSizeOrderName = 22
    const fontSizeTextOrderName = this.getWidthHeightText(fontSizeOrderName, order.orderName, 'bold')
    const paddingVerticalOrderName = barcodeAreaHeight + fontSizeTextOrderName.height + ((headerAreaHeigth - fontSizeTextOrderName.height) / 2)
    const paddingHorizontalOrderName = ((leftAreaHeader - padding - fontSizeTextOrderName.width) / 2)
    this.updatePosition(order.id, {
      orderName: {
        label: order.orderName,
        x: startX + padding + paddingHorizontalOrderName,
        y: startY + paddingVerticalOrderName,
        size: fontSizeOrderName,
        weight: 'bold'
      }
    })

    const fontSizeOrderId = 16
    const fontSizeTextOrderId = this.getWidthHeightText(fontSizeOrderId, order.orderId, 'bold')
    const paddingVerticalOrderIdText = ((headerAreaHeigth / 2) - fontSizeTextOrderId.height) / 2
    const paddingHorizontalOrderId = (rightAreaHeader - padding - fontSizeTextOrderId.width) / 2
    this.updatePosition(order.id, {
      orderId: {
        label: order.orderId,
        x: startX + leftAreaHeader + paddingHorizontalOrderId,
        y: startY + barcodeAreaHeight + fontSizeTextOrderId.height + paddingVerticalOrderIdText,
        size: fontSizeOrderId,
        weight: 'bold'
      }
    })

    const fontSizeOrderPage = 14
    const orderPageText = `${Number(order.id) + 1} of ${orderList.length}`
    const fontSizeTextOrderPage = this.getWidthHeightText(fontSizeOrderPage, orderPageText, 'normal')
    const paddingVerticalOrderPageText = ((headerAreaHeigth / 2) - fontSizeTextOrderPage.height) / 2
    const paddingHorizontalOrderPage = (rightAreaHeader - padding - fontSizeTextOrderPage.width) / 2
    this.updatePosition(order.id, {
      orderPage: {
        label: orderPageText,
        x: startX + leftAreaHeader + paddingHorizontalOrderPage,
        y: startY + barcodeAreaHeight + fontSizeTextOrderPage.height + paddingVerticalOrderPageText + (headerAreaHeigth / 2),
        size: fontSizeOrderPage,
        weight: 'normal'
      }
    })

    const startXContent = startX + paddingContentHorizontal
    const startYContent = startY + barcodeAreaHeight + headerAreaHeigth
    let heightContent = startYContent

    const reciverNameText = [`ผู้รับ: ${order.reciver.name} `, `T: ${order.reciver.phoneNumber}`]
    const reciverNameSizeText = 12
    const reciverNameFit = 20
    const reciverNameDetails = this.getDetailsTextGroup(reciverNameText, reciverNameSizeText, 'bold', reciverNameFit)
    heightContent += paddingContentVertical
    this.updatePosition(order.id, {
      reciverName: {
        ...reciverNameDetails,
        fit: reciverNameFit,
        x: startXContent,
        y: heightContent,
        size: reciverNameSizeText,
        weight: 'bold'
      }
    })

    const reciverAddressText = order.reciver.address.split(' ')
    const reciverAddressSizeText = 12
    const reciverAddressFit = 18
    const reciverAddressDetails = this.getDetailsTextGroup(reciverAddressText, reciverAddressSizeText, 'bold', reciverAddressFit)
    heightContent += reciverNameDetails.height + 10
    this.updatePosition(order.id, {
      reciverAddress: {
        ...reciverAddressDetails,
        fit: reciverAddressFit,
        x: startXContent,
        y: heightContent,
        size: reciverAddressSizeText,
        weight: 'bold'
      }
    })

    const senderNameText = [`ผู้ส่ง: ${order.reciver.name} `, `T: ${order.reciver.phoneNumber}`]
    const senderNameSizeText = 10
    const senderNameFit = 16
    const senderNameDetails = this.getDetailsTextGroup(senderNameText, senderNameSizeText, 'normal', senderNameFit, qrcodeAreaWidth)
    heightContent += reciverAddressDetails.height + 20
    this.updatePosition(order.id, {
      senderName: {
        ...senderNameDetails,
        fit: senderNameFit,
        x: startXContent,
        y: heightContent,
        size: senderNameSizeText,
      }
    })

    this.updatePosition(order.id, {
      checkpointQr: this.getCheckPointQr(heightContent - 10)
    })

    const senderAddressText = order.sender.address.split(' ')
    const senderAddressSizeText = 10
    const senderAddressFit = 16
    const senderAddressDetails = this.getDetailsTextGroup(senderAddressText, senderAddressSizeText, 'normal', senderAddressFit, qrcodeAreaWidth)
    heightContent += senderNameDetails.height + 10
    this.updatePosition(order.id, {
      senderAddress: {
        ...senderAddressDetails,
        fit: senderAddressFit,
        x: startXContent,
        y: heightContent,
        size: senderAddressSizeText,
      }
    })

    const orderDetailsText = [`${order.date}, `, `${order.type}, `, `${order.weight}`]
    const orderDetailsTextSize = 10
    const orderDetailsFit = 16
    const orderDetails = this.getDetailsTextGroup(orderDetailsText, orderDetailsTextSize, 'normal', orderDetailsFit, qrcodeAreaWidth)
    heightContent += senderAddressDetails.height + 20
    this.updatePosition(order.id, {
      orderDetails: {
        ...orderDetails,
        fit: orderDetailsFit,
        x: startXContent,
        y: heightContent,
        size: orderDetailsTextSize,
      }
    })

    const orderEgTextSize = 10
    const orderEgFit = 16
    const textArr = this.splitLineText(`หมายเหตุ: ${order.eg}`, orderEgTextSize, orderEgFit, 'normal')
    const egDetails = this.getDetailsTextGroup(textArr, orderEgTextSize, 'normal', orderEgFit)
    heightContent += orderDetails.height + 20
    this.updatePosition(order.id, {
      orderEg: {
        ...egDetails,
        fit: orderEgFit,
        x: startXContent,
        y: heightContent,
        size: orderEgTextSize,
      }
    })

    heightContent += egDetails.height + paddingContentVertical

    this.setCurrentSizePosition(heightContent)

    this.updatePosition(order.id, {
      lineTop: {
        startX,
        startY,
        endX: startX + width,
        endY: startY
      }
    })
    this.updatePosition(order.id, {
      lineLeft: {
        startX,
        startY,
        endX: startX,
        endY: heightContent
      }
    })

    this.updatePosition(order.id, {
      lineRight: {
        startX: startX + width,
        startY,
        endX: startX + width,
        endY: heightContent
      }
    })

    this.updatePosition(order.id, {
      lineBottom: {
        startX: startX,
        startY: heightContent,
        endX: startX + width,
        endY: heightContent
      }
    })

    this.updatePosition(order.id, {
      checkpointBarcode: this.convertPositionBarCode(startX, startY)
    })
  }
}

export default CanvasLogic
