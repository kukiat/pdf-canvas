import { isEmpty } from 'lodash'
import { getHeigthFromRatio } from '../../libs/utils'
import {
  FONT_FAMILY,
  HEADDER_HEIGHT,
  BARCODE_HEIGHT,
  PADDING_CONTENT_HORIZONTAL,
  PADDING_CONTENT_VERTICAL,
  QRCODE_WIDTH
} from './config'

class CanvasLogic {
  constructor(width, padding, gap) {
    this.position = new Map()
    this.page = 1
    this.width = width
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
      y: (BARCODE_HEIGHT - 72) / 2 + y
    }
  }

  getCheckPointQr(x, y, currentHeight) {
    const area = (this.width - (this.padding * 2) - this.gap) / 2
    return {
      x: x + area - QRCODE_WIDTH - PADDING_CONTENT_HORIZONTAL,
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
    let position = []
    this.position.forEach(p => position.push({
      height: p.height,
      startX: p.startX,
      startY: p.startY
    }))

    const maxHeight = getHeigthFromRatio('a4')(this.width)
    let newPosition = []
    let left = 0
    let right = 0
    let page = 1
    const initX = (p) => (maxHeight * (p - 1) + 10)

    for (let i = 0; i < position.length; i++) {
      const height = position[i].height
      if (left + height < maxHeight || right + height < maxHeight) {
        if (left > right) {
          newPosition.push({
            startX: this.padding + (this.width - this.gap) / 2,
            startY: initX(page) + right
          })
          right += height
        } else {
          newPosition.push({
            startX: this.padding,
            startY: initX(page) + left
          })
          left += height
        }
      } else {
        left = height
        right = 0
        page += 1
        newPosition.push({
          startX: 10,
          startY: initX(page)
        })
      }
    }
    this.page = page
    return newPosition
  }

  setPosition(id, data) {
    this.position.set(id, {
      side: this.currentSide,
      ...data
    })
  }

  getPageSize() {
    return {
      width: this.width,
      height: getHeigthFromRatio('a4')(this.width) * this.page
    }
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
    const maxWidth = ((this.width - (this.padding * 2) - this.gap) / 2) - (PADDING_CONTENT_HORIZONTAL * 2) - areaWidth
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
    const maxWidth = (this.width / 2) - (this.padding * 2) - (PADDING_CONTENT_HORIZONTAL * 2)
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
    const newPosition = this.sortPage()
    newPosition.forEach((p, index) => {
      this.calculateItem(orderList[index], p, orderList)
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
        startY: startY + BARCODE_HEIGHT,
        endX: startX + width - padding,
        endY: startY + BARCODE_HEIGHT,
      }
    })

    this.updatePosition(order.id, {
      line2: {
        startX: startX + padding,
        startY: startY + BARCODE_HEIGHT + HEADDER_HEIGHT,
        endX: startX + width - padding,
        endY: startY + BARCODE_HEIGHT + HEADDER_HEIGHT
      }
    })

    this.updatePosition(order.id, {
      leftAreaHeader,
      rightAreaHeader,
      line3: {
        startX: startX + leftAreaHeader,
        startY: startY + BARCODE_HEIGHT,
        endX: startX + leftAreaHeader,
        endY: startY + BARCODE_HEIGHT + HEADDER_HEIGHT
      }
    })

    const fontSizeOrderName = 22
    const fontSizeTextOrderName = this.getWidthHeightText(fontSizeOrderName, order.orderName, 'bold')
    const paddingVerticalOrderName = BARCODE_HEIGHT + fontSizeTextOrderName.height + ((HEADDER_HEIGHT - fontSizeTextOrderName.height) / 2)
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
    const paddingVerticalOrderIdText = ((HEADDER_HEIGHT / 2) - fontSizeTextOrderId.height) / 2
    const paddingHorizontalOrderId = (rightAreaHeader - padding - fontSizeTextOrderId.width) / 2
    this.updatePosition(order.id, {
      orderId: {
        label: order.orderId,
        x: startX + leftAreaHeader + paddingHorizontalOrderId,
        y: startY + BARCODE_HEIGHT + fontSizeTextOrderId.height + paddingVerticalOrderIdText,
        size: fontSizeOrderId,
        weight: 'bold'
      }
    })

    const fontSizeOrderPage = 14
    const orderPageText = `${Number(order.id) + 1} of ${orderList.length}`
    const fontSizeTextOrderPage = this.getWidthHeightText(fontSizeOrderPage, orderPageText, 'normal')
    const paddingVerticalOrderPageText = ((HEADDER_HEIGHT / 2) - fontSizeTextOrderPage.height) / 2
    const paddingHorizontalOrderPage = (rightAreaHeader - padding - fontSizeTextOrderPage.width) / 2
    this.updatePosition(order.id, {
      orderPage: {
        label: orderPageText,
        x: startX + leftAreaHeader + paddingHorizontalOrderPage,
        y: startY + BARCODE_HEIGHT + fontSizeTextOrderPage.height + paddingVerticalOrderPageText + (HEADDER_HEIGHT / 2),
        size: fontSizeOrderPage,
        weight: 'normal'
      }
    })

    const startXContent = startX + PADDING_CONTENT_HORIZONTAL
    const startYContent = startY + BARCODE_HEIGHT + HEADDER_HEIGHT
    let heightContent = startYContent

    const reciverNameText = [`ผู้รับ: ${order.reciver.name} `, `T: ${order.reciver.phoneNumber}`]
    const reciverNameSizeText = 12
    const reciverNameFit = 20
    const reciverNameDetails = this.getDetailsTextGroup(reciverNameText, reciverNameSizeText, 'bold', reciverNameFit)
    heightContent += PADDING_CONTENT_VERTICAL
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
    const senderNameDetails = this.getDetailsTextGroup(senderNameText, senderNameSizeText, 'normal', senderNameFit, QRCODE_WIDTH)
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
      checkpointQr: this.getCheckPointQr(startX, startY, heightContent - 10)
    })

    const senderAddressText = order.sender.address.split(' ')
    const senderAddressSizeText = 10
    const senderAddressFit = 16
    const senderAddressDetails = this.getDetailsTextGroup(senderAddressText, senderAddressSizeText, 'normal', senderAddressFit, QRCODE_WIDTH)
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
    const orderDetails = this.getDetailsTextGroup(orderDetailsText, orderDetailsTextSize, 'normal', orderDetailsFit, QRCODE_WIDTH)
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

    heightContent += egDetails.height + PADDING_CONTENT_VERTICAL

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

    this.updatePosition(order.id, {
      height: heightContent - startY + PADDING_CONTENT_VERTICAL,
      width
    })
  }
}

export default CanvasLogic
