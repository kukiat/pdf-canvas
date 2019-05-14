import React, { Component } from 'react'
import { orderList } from './data'
import { OrderPreview } from '../../features'

class OrderPage extends Component {
  constructor(props) {
    super(props)
    this.state = {
      orderList
    }
  }

  render() {
    return (
      <div>
        <OrderPreview orderList={orderList} />
      </div>
    )
  }
}

export default OrderPage
