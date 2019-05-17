import { Component } from 'react';

class ModalLogic extends Component {
  state = {
    isOpen: false
  }

  onOpen = () => {
    this.setState({ isOpen: true });
  }

  onClose = () => {
    this.setState({ isOpen: false });
  }

  render() {
    const { children } = this.props
    const { isOpen } = this.state
    return children({
      isOpen,
      onOpen: this.onOpen,
      onClose: this.onClose,
    })
  }
}
export default ModalLogic
