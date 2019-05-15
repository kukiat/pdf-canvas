import React, { Component } from 'react';
import Modal from 'react-modal';
import styles from '../modalStyle'

class ModalWrapper extends Component {
  render() {
    const { isOpen, onCloseModal } = this.props
    return (
      <Modal
        isOpen={isOpen}
        onRequestClose={onCloseModal}
        style={styles}
      >
        {this.props.children}
      </Modal>
    );
  }
}

export default ModalWrapper
