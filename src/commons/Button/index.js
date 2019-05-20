import { Button as ButtonAntd } from 'antd'
import PropTypes from 'prop-types'
import classNames from 'classnames'
import React from 'react'
import './index.scss'

const Button = ({
  children,
  className,
  onClick,
  disabled,
  ...props
}) => {
  return (
    <ButtonAntd
      className={classNames("bo-button", className)}
      onClick={!disabled ? onClick : () => { }}
      disabled={disabled}
      {...props}
    >

      {children}
    </ButtonAntd>
  )
}

Button.defaultProps = {
  onClick: () => { },
  disabled: false,
  className: '',
}

Button.propTypes = {
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
}

export default Button
