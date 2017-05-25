import React from 'react';
import { render } from 'react-dom';
import { Provider, connect } from 'react-redux';
import { withRouter } from 'react-router';
import { Route } from 'react-router-dom';
import { ConnectedRouter } from 'react-router-redux';

import Main from 'containers/Main';

import store, { history } from 'utils/store';
import './main.scss';

export default function mapStateToProps(state) {
  return { ...state };
}

const App = withRouter(connect(mapStateToProps)(Main));

const appWrapper = (
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <Route path="/" render={props => <App {...props} />} />
    </ConnectedRouter>
  </Provider>
);

render(appWrapper, document.querySelector('.mount'));


// import FourOhFour from 'views/404';

// import Login from 'views/Auth/Login';
// import SetPassword from 'views/Auth/SetPassword';
// import ForgotPassword from 'views/Auth/ForgotPassword';

// <Route path="/admin/login" component={Login} />
// <Route path="/admin/sp/:token" component={SetPassword} />
// <Route path="/admin/fp" component={ForgotPassword} />

// <Route path="*" component={FourOhFour} />
