import React, { Component } from 'react';
import { Button } from '../../../commons'
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
          <div className="modal-footer">
            <Button className="btn-footer" onClick={alert}>
              Download
            </Button>
            <Button className="btn-footer" onClick={() => { }}>
              Print
            </Button>
          </div>
        </div>
      </Modal >
    );
  }
}

export default ModalWrapper
