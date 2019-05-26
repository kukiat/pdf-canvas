import React from 'react'
import ReactDOM from 'react-dom'
import Modal from 'react-modal'
import './index.scss'
import 'antd/dist/antd.css'
import Routes from './Routes'
import * as serviceWorker from './serviceWorker'

Modal.setAppElement('#root')

ReactDOM.render(<Routes />, document.getElementById('root'))

serviceWorker.unregister()
