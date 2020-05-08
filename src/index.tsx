import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import configureStore from "./redux/store";
import {Provider} from "react-redux";
// import {ReduxToastr} from "react-redux-toastr/src/ReduxToastr";

const store = configureStore({});

ReactDOM.render(
    <Provider store={store}>
        <App/>
        {/*<ReduxToastr/>*/}
    </Provider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
