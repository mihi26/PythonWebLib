import React from 'react'
import Layout from './components/Layout'
import { BrowserRouter,Route,Switch } from 'react-router-dom'
import Login from 'src/components/Auth/Login'
import Register from 'src/components/Auth/Register'
import NotFound from './components/NotFound'
import {PrivateRoute} from "src/components/PrivateRoute";
export default function App() {
    return (
        <BrowserRouter>
          <Switch>
            <Route exact path="/login" component={Login}/>
            <Route path="/register" component={Register}/>
            <PrivateRoute path="/" component={Layout}/>
            <Route component={NotFound}/>
          </Switch>
        </BrowserRouter>
    )
}
