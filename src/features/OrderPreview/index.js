import React from 'react';
import OrderPreviewItem from './OrderPreviewItem'
import './index.scss'
class OrderPreview extends React.Component {
  render() {
    const { orderList } = this.props
    return (
      <div className="order-list-container">
        {
          orderList.map((order) => (
            <OrderPreviewItem
              key={order.id}
              order={order}
            />
          ))
        }
      </div >
    );
  }
}

export default OrderPreview;
