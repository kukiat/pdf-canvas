import { Component } from 'react';

class ModalLogic extends Component {
  state = {
    isOpen: false
  }

  onOpenModal = () => {
    this.setState({ isOpen: true });
  }

  onCLoseModal = () => {
    this.setState({ isOpen: false });
  }

  render() {
    const { children } = this.props
    const { isOpen } = this.state
    return children({
      isOpen,
      onOpenModal: this.onOpenModal,
      onCLoseModal: this.onCLoseModal,
    })
  }
}
export default ModalLogic
