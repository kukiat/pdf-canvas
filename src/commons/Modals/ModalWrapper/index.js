import React, { Component } from 'react';
import jsPDF from 'jspdf'
import { Button } from '../../../commons'
import Modal from 'react-modal';
import styles from '../modalStyle'
import './index.scss'

class ModalWrapper extends Component {
  onDownload = (canvas) => {
    // const img = canvas.toDataURL("image/jpeg", 1.0)
    // const pdf = new jsPDF()

    // pdf.addImage(img, 'JPEG', 0, 0)
    // pdf.save("download.pdf")
    const pdf = new jsPDF('p', 'pt', 'a4');
    const options = {
      pagesplit: true
    }
    // console.log($('.test'))
    // pdf.addHTML(document.getElementById('test'), (x, y) => {
    //   pdf.save('web.pdf');
    // });

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
            <div id='test'>
              {this.props.children}
            </div>
          </div>
          <div className="modal-footer">
            <Button className="btn-footer" onClick={this.onDownload}>
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
