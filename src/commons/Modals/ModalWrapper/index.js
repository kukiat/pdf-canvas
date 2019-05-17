import React, { Component } from 'react';
import { Button } from 'antd'
import Modal from 'react-modal';
import styles from '../modalStyle'
import './index.scss'

class ModalWrapper extends Component {
  render() {
    const { isOpen, onClose } = this.props
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        style={styles}
      >
        <div className="modal-container">
          {/* <div className="modal-header">
            <b>พิมพ์ป้ายพัสดุ</b>
          </div> */}
          <div className="modal-content">
            {this.props.children}
          </div>
          {/* <div className="modal-footer">
            <Button type="primary" size='large' block style={{ backgroundColor: 'green' }}>
              พิมพ์
          </Button>
          </div> */}
        </div>
      </Modal >
    );
  }
}

export default ModalWrapper
