import React from "react"
import { Switch, HashRouter, Route } from "react-router-dom"
import Input from '../demos/Input'
import Links from './links'

const Routers = () => {
  return <HashRouter>
    <Switch>
      <Route path='/input' component={Input} />
      <Route path='/' component={Links} />
    </Switch>
  </HashRouter>
}

export default Routers