import React, { Component } from 'react';
import ReactToPrint from "react-to-print";
import jsPDF from 'jspdf'
import { Button } from '../../../commons'
import Modal from 'react-modal';
import styles from '../modalStyle'
import './index.scss'

class ModalWrapper extends Component {
  onDownload = () => {

  }

  onPrint = () => {

  }

  render() {
    const { modal: { isOpen, onClose } } = this.props
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onClose}
        style={styles}
      >
        <div className="modal-container">
          {/* <div className="modal-header" ref={node => this.test = node}>
            <b>พิมพ์ป้ายพัสดุ</b>
          </div> */}
          <div className="modal-content">
            <div >
              {this.props.children}
            </div>
          </div>
          {/* <div className="modal-footer">
            <Button className="btn-footer" onClick={this.onDownload}>
              Download
            </Button>
            <Button className="btn-footer" onClick={() => { }}>
              Print
            </Button>
          </div> */}
        </div>
      </Modal >
    );
  }
}

export default ModalWrapper
