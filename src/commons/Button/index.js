import React, { PureComponent } from 'react'
import { Button } from 'antd'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import './index.scss'

class CustomButton extends PureComponent {
  static defaultProps = {
    onClick: () => {},
    disabled: false,
    className: ''
  }

  static propTypes = {
    onClick: PropTypes.func,
    disabled: PropTypes.bool,
    className: PropTypes.string
  }

  render() {
    const { children, className, onClick, disabled } = this.props
    return (
      <Button
        {...this.props}
        className={classNames('bo-button', className)}
        onClick={!disabled ? onClick : () => {}}
        disabled={disabled}
      >
        {children}
      </Button>
    )
  }
}

export default CustomButton
