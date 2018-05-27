/* eslint-disable import/first */

import './main.scss'
import React from 'react'
import { render } from 'react-dom'
import { Provider, connect } from 'react-redux'
import { withRouter } from 'react-router'
import { Switch, Route } from 'react-router-dom'
import { ConnectedRouter } from 'react-router-redux'
import Main from 'containers/Main'
import Login from 'views/Auth/Login'
import SetPassword from 'views/Auth/SetPassword'
import ForgotPassword from 'views/Auth/ForgotPassword'
import ErrorContainer from 'containers/ErrorContainer'
import Install from 'views/Auth/Install'
import store, { history } from 'utils/store'

export default function mapStateToProps (state) {
  return { ...state }
}

const App = withRouter(connect(mapStateToProps)(Main))

const appWrapper = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Switch>
        <Route exact path="/error" component={ErrorContainer} />
        <Route exact path="/login" component={Login} />
        <Route exact path="/sp/:token" component={SetPassword} />
        <Route exact path="/fp" component={ForgotPassword} />
        <Route exact path="/install" component={Install} />
        <Route path="/" render={props => <App {...props} />} />
      </Switch>
    </ConnectedRouter>
  </Provider>
)

render(appWrapper, document.querySelector('.mount'))
