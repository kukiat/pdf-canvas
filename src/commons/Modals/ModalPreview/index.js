import React, { Component } from 'react'
import { Button } from '../..'
import jsPDF from 'jspdf'
import ReactToPrint from 'react-to-print'
import Modal from 'react-modal'
import styles from '../modalStyle'
import './index.scss'

class ModalPreview extends Component {
  constructor() {
    super()
    this.div = null
  }

  onDownload = () => {
    const pdf = new jsPDF('p', 'pt', 'a4')
    const canvasNode = this.div.firstElementChild.childNodes
    canvasNode.forEach((canvas, pageIndex) => {
      pdf.addImage(canvas.toDataURL(), 'PNG', 0, 0)

      const isLastPage = pageIndex === canvasNode.length - 1
      if (!isLastPage) {
        pdf.addPage()
      }
    })
    pdf.save('download.pdf')
  }

  renderModalHeader = () => (
    <div className="modal-header">
      <div className="btn-set-order-preview">
        <Button onClick={this.onDownload} className="download-btn">
          Download
        </Button>
        <ReactToPrint
          copyStyles={false}
          trigger={() => <Button className="print-btn">Print</Button>}
          content={() => this.div}
        />
      </div>
    </div>
  )

  render() {
    const {
      modal: { isOpen, onClose }
    } = this.props
    return (
      <Modal isOpen={isOpen} onRequestClose={onClose} style={styles}>
        <div className="modal-container">
          {this.renderModalHeader()}
          <div className="modal-content">
            <div ref={n => (this.div = n)}>{this.props.children}</div>
          </div>
        </div>
      </Modal>
    )
  }
}

export default ModalPreview
