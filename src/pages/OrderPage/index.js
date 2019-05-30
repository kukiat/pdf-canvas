import React, { Component } from 'react'
import { orderList } from './data'
import { Button } from '../../commons'
import { OrderPreview, OrderList } from '../../features'
import { ModalPreview } from '../../commons'
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
          name: 'นายอดัม พันธะเตชะ',
          phoneNumber: '091-108-5518',
          address: "16/176 หมู่ 8 ซอยรัตนาธิเบต หมู่บ้านชาตรีพิเศก 3 เขตจตุจักร อ.จตุจักร จ.กรุงเทพมหานคร 11000",
        },
        date: '16/01/1996 13:31',
        type: 'Envelop',
        weight: '0.07 g',
        eg: 'In the draw for the round of 16'
      })
    })
  }

  render() {
    const { orderList } = this.state
    const { modals } = this.props
    return (
      <div className='order-page-container'>
        <div className='button-set'>
          <Button onClick={this.onCreateOrder}>Add order</Button>
          <Button onClick={modals.previewOrder.onOpen}>Preview</Button>
        </div>
        <OrderList orderList={orderList} />

        <ModalPreview modal={modals.previewOrder}>
          <OrderPreview orderList={orderList} />
        </ModalPreview>
      </div>
    )
  }
}

export default withModal()(OrderPage)
