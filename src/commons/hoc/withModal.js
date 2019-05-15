import React from 'react'
import { Adopt } from 'react-adopt'
import ModalLogic from '../Modals/ModalWrapper/ModalLogic'

const withModal = (options) => (BaseComponent) => (props) => (
  <Adopt
    mapper={{
      previewOrder: <ModalLogic />,
      ...options
    }}
  >
    {
      (mapper) => (
        <BaseComponent {...props} modals={mapper} />
      )
    }
  </Adopt>
)

export default withModal
