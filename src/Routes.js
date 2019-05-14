import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'
import { OrderPage } from './pages'

const Routes = () => {
  return (
    <BrowserRouter>
      <Switch>
        <Route component={OrderPage} path="/" />
      </Switch>
    </BrowserRouter>
  )
}

export default Routes
