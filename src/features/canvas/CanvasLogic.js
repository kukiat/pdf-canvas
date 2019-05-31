import { isEmpty } from 'lodash'
import { getWidthHeightText } from '../../libs/utils'
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
    this.pageSize = 1
  }

  calculate(orderList) {
    this.pageSize = Math.ceil(orderList.length / 4)
    orderList.forEach(order => {
      this.calculateItem(order, orderList)
    })
  }

  getStartXY(orderId) {
    const id = Number(orderId)
    const setXY = (startX, startY) => ({ startX, startY, number: Math.ceil((id + 1) / 4) })

    switch (id % 4) {
      case 0:
        return setXY(10, 140)
      case 1:
        return setXY(400, 140)
      case 2:
        return setXY(10, 560)
      case 3:
        return setXY(400, 560)
      default:
        return
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
    const width = this.getWidthInner()
    return {
      x: x + width - QRCODE_WIDTH - PADDING_CONTENT_HORIZONTAL,
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
    return (this.width - this.padding * 2 - this.gap) / 2
  }

  setPosition(id, data) {
    this.position.set(id, {
      ...data
    })
  }

  getPosition(id) {
    return this.position.get(id)
  }

  getDetailsTextGroup(textArr, size, weight, fit = 0, areaWidth = 0, limit = 1) {
    const maxWidth = this.getWidthInner() - PADDING_CONTENT_HORIZONTAL * 2 - areaWidth
    let widthTemp = 0
    let totalText = []
    let totalHeight = 0
    textArr.forEach(text => {
      const { width, height } = getWidthHeightText(size, text, weight, FONT_FAMILY)
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

    const totalTextLimit = totalText.slice(0, limit)
    return {
      line: totalTextLimit.length,
      totalText: totalTextLimit,
      width: maxWidth,
      height: totalHeight
    }
  }

  splitLineText(text, size, fit, weight) {
    const maxWidth = this.width / 2 - this.padding * 2 - PADDING_CONTENT_HORIZONTAL * 2
    let newText = ['']
    let eachWidth = 0
    let currectLine = 0
    for (let word of text) {
      const { width } = getWidthHeightText(size, word, weight, FONT_FAMILY)
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

  calculateItem(order, orderList) {
    const { startX, startY, number } = this.getStartXY(order.id)
    const padding = 10
    const width = this.getWidthInner()

    const leftAreaHeader = Math.floor(0.65 * width)
    const rightAreaHeader = width - leftAreaHeader
    this.setPosition(order.id, { startX, startY })
    this.updatePosition(order.id, { pageNumber: number })
    this.updatePosition(order.id, {
      line1: {
        startX: startX + padding,
        startY: startY + BARCODE_HEIGHT,
        endX: startX + width - padding,
        endY: startY + BARCODE_HEIGHT
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
    const fontSizeTextOrderName = getWidthHeightText(fontSizeOrderName, order.orderName, 'bold', FONT_FAMILY)
    const paddingVerticalOrderName =
      BARCODE_HEIGHT + fontSizeTextOrderName.height + (HEADDER_HEIGHT - fontSizeTextOrderName.height) / 2
    const paddingHorizontalOrderName = (leftAreaHeader - padding - fontSizeTextOrderName.width) / 2
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
    const fontSizeTextOrderId = getWidthHeightText(fontSizeOrderId, order.orderId, 'bold', FONT_FAMILY)
    const paddingVerticalOrderIdText = (HEADDER_HEIGHT / 2 - fontSizeTextOrderId.height) / 2
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
    const fontSizeTextOrderPage = getWidthHeightText(fontSizeOrderPage, orderPageText, 'normal', FONT_FAMILY)
    const paddingVerticalOrderPageText = (HEADDER_HEIGHT / 2 - fontSizeTextOrderPage.height) / 2
    const paddingHorizontalOrderPage = (rightAreaHeader - padding - fontSizeTextOrderPage.width) / 2
    this.updatePosition(order.id, {
      orderPage: {
        label: orderPageText,
        x: startX + leftAreaHeader + paddingHorizontalOrderPage,
        y: startY + BARCODE_HEIGHT + fontSizeTextOrderPage.height + paddingVerticalOrderPageText + HEADDER_HEIGHT / 2,
        size: fontSizeOrderPage,
        weight: 'normal'
      }
    })

    const startXContent = startX + PADDING_CONTENT_HORIZONTAL
    const startYContent = startY + BARCODE_HEIGHT + HEADDER_HEIGHT
    let heightContent = startYContent

    const reciverNameText = [`ผู้รับ: ${order.reciver.name} T:${order.reciver.phoneNumber}`]
    heightContent += PADDING_CONTENT_VERTICAL
    const recivedNameData = {
      height: 9.6,
      line: 1,
      totalText: reciverNameText,
      width: 360,
      fit: 20,
      x: startXContent,
      y: heightContent,
      size: 12,
      weight: 'bold'
    }
    this.updatePosition(order.id, {
      reciverName: recivedNameData
    })

    const reciverAddressText = order.reciver.address.split(' ').map(text => `${text} `)
    const reciverAddressSizeText = 12
    const reciverAddressFit = 18
    const reciverAddressDetails = this.getDetailsTextGroup(
      reciverAddressText,
      reciverAddressSizeText,
      'bold',
      reciverAddressFit,
      0,
      3
    )
    heightContent += recivedNameData.height + 10
    const reciverAddressData = {
      height: 45.6,
      line: reciverAddressDetails.line,
      totalText: reciverAddressDetails.totalText,
      width: 360,
      fit: reciverAddressFit,
      x: startXContent,
      y: heightContent,
      size: reciverAddressSizeText,
      weight: 'bold'
    }
    this.updatePosition(order.id, {
      reciverAddress: reciverAddressData
    })

    const senderNameText = [`ผู้ส่ง: ${order.reciver.name} T: ${order.reciver.phoneNumber}`]
    heightContent += reciverAddressData.height + 20
    const senderNameData = {
      height: 8,
      width: 272,
      totalText: senderNameText,
      line: 1,
      fit: 16,
      x: startXContent,
      y: heightContent,
      size: 10
    }
    this.updatePosition(order.id, {
      senderName: senderNameData
    })

    this.updatePosition(order.id, {
      checkpointQr: this.getCheckPointQr(startX, startY, heightContent - 10)
    })

    const senderAddressText = order.sender.address.split(' ').map(text => `${text} `)
    const senderAddressSizeText = 10
    const senderAddressFit = 16
    const senderAddressDetails = this.getDetailsTextGroup(
      senderAddressText,
      senderAddressSizeText,
      'normal',
      senderAddressFit,
      QRCODE_WIDTH,
      3
    )
    heightContent += senderNameData.height + 10
    const senderAddressData = {
      height: 40,
      line: senderAddressDetails.line,
      width: 272,
      totalText: senderAddressDetails.totalText,
      fit: senderAddressFit,
      x: startXContent,
      y: heightContent,
      size: senderAddressSizeText
    }
    this.updatePosition(order.id, {
      senderAddress: senderAddressData
    })

    const orderDetailsText = [`${order.date}, ${order.type}, ${order.weight}`]
    heightContent += senderAddressData.height + 20
    const orderDetailsData = {
      height: 8,
      width: 272,
      totalText: orderDetailsText,
      line: 1,
      fit: 16,
      x: startXContent,
      y: heightContent,
      size: 10
    }
    this.updatePosition(order.id, {
      orderDetails: orderDetailsData
    })

    const orderEgTextSize = 10
    const orderEgFit = 16
    const textArr = this.splitLineText(`หมายเหตุ: ${order.eg}`, orderEgTextSize, orderEgFit, 'normal')
    const egDetails = this.getDetailsTextGroup(textArr, orderEgTextSize, 'normal', orderEgFit, 0, 2)
    heightContent += orderDetailsData.height + 20
    const orderEgData = {
      height: 24,
      line: egDetails.line,
      width: 360,
      totalText: egDetails.totalText,
      fit: orderEgFit,
      x: startXContent,
      y: heightContent,
      size: orderEgTextSize
    }
    this.updatePosition(order.id, {
      orderEg: orderEgData
    })

    heightContent += orderEgData.height + PADDING_CONTENT_VERTICAL

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
