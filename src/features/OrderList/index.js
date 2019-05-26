import React from 'react'
import { Card } from 'antd'
import './index.scss'

const OrderList = ({ orderList }) => {
  return (
    <div className="order-list-container">
      {orderList.map((order, index) => (
        <Card title={order.orderName} key={index}>
          <div className="text-group">
            <h4>ผู้ส่ง</h4>
            <p>{order.sender.name}</p>
          </div>
          <div className="text-group">
            <h4>ผู้รับ</h4>
            <p>{order.reciver.name}</p>
          </div>
          <div className="text-group">
            <h4>วันที่</h4>
            <p>{order.date}</p>
          </div>
        </Card>
      ))}
    </div>
  )
}

export default OrderList
