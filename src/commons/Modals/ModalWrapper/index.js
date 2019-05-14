import React, { Component } from 'react';
import Modal from 'react-modal';
import styles from '../modalStyle'

class ModalWrapper extends Component {
  constructor() {
    super();
    this.state = {
      modalIsOpen: false
    };
  }

  openModal = () => {
    this.setState({ modalIsOpen: true });
  }

  closeModal = () => {
    this.setState({ modalIsOpen: false });
  }

  render() {
    return (
      <Modal
        isOpen={this.state.modalIsOpen}
        onRequestClose={this.closeModal}
        style={styles}
        contentLabel="Example Modal"
      >
        {this.props.children}
      </Modal>
    );
  }
}

export default ModalWrapper
