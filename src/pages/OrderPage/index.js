import React, { Component } from 'react'
import { orderList } from './data'
import { Button } from 'antd'
import { OrderPreview, OrderList } from '../../features'
import { ModalWrapper } from '../../commons'
import withModal from '../../commons/hoc/withModal'
import './index.scss'

class OrderPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderList
    }
  }

  onCreateOrder = () => {
    const { orderList } = this.state
    this.setState({
      orderList: orderList.concat({
        id: String(this.state.orderList.length),
        barcode: '01231117890128-IT',
        orderName: 'TX12005TH',
        orderId: 'OR014A',
        reciver: {
          name: 'นายกู้เกียรติ วังทะพันธ์',
          phoneNumber: '091-108-5517',
          address: "16/176 หมู่.8 ถ.พิบูลสงคราม จ.นนทบุรี 11000",
        },
        sender: {
          name: 'นายอดัม หำใหญ่',
          phoneNumber: '091-108-5518',
          address: "16/176 หมู่.8 อ.เมือง จ.นนทบุรี 11000",
        },
        date: '16/01/1996 13:31',
        type: 'Envelop',
        weight: '0.07 g',
        eg: 'wdadwadssdw wdadwawdawd'
      })
    })
  }

  render() {
    const { orderList } = this.state
    const { modals } = this.props
    return (
      <div className='order-page-container'>
        <div className='button-set'>
          <Button type="primary" onClick={this.onCreateOrder}>Add order</Button>
          <Button type="primary" onClick={modals.previewOrder.onOpen}>Preview</Button>
        </div>
        <OrderList orderList={orderList} />
        <ModalWrapper {...modals.previewOrder}>
          <OrderPreview orderList={orderList} />
        </ModalWrapper>
      </div>
    )
  }
}

export default withModal()(OrderPage)
