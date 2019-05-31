import React from 'react'
import { Adopt } from 'react-adopt'

const withModal = options => BaseComponent => props => (
  <Adopt
    mapper={{ ...options }}
  >
    {
      mapper => <BaseComponent {...props} modals={mapper} />
    }
  </Adopt>
)

export default withModal
