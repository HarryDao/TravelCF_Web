import 'babel-polyfill';
import React from 'react';
import ReactDom from 'react-dom';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import './styles/index.less';
import reducers from './reducers';
import Thunk from './middlewares/Thunk';
import App from './App';
import { LOGIN_SUCCESS } from './actions/types';
import LS from './services/LocalStorage';

const store = createStore(reducers, {}, applyMiddleware(Thunk));

// Retrieve User Token from Local Storage
const { token, email } = LS.GetToken();
if (token && email) {
    store.dispatch({ type: LOGIN_SUCCESS, payload: email });
}

ReactDom.render(
    <Provider store={store}>
        <div className="inner">
            <App />
        </div>
    </Provider>
, document.querySelector('#root'));