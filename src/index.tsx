import React from 'react';
import ReactDOM from 'react-dom';
import './index.scss';
import App from './App';
import * as serviceWorker from './serviceWorker';
import {Provider} from "react-redux";
import store from "./redux/store";
import {Router} from "react-router-dom";
import {SnackbarProvider} from "notistack";
import history from './history';
import * as Sentry from '@sentry/browser';

Sentry.init({dsn: "https://152ac18d2299434b96e9b3b784973578@o153106.ingest.sentry.io/5240603"});

ReactDOM.render(
    <SnackbarProvider maxSnack={1}>
        <Provider store={store}>
            <Router history={history}>
                <App/>
            </Router>
        </Provider>
    </SnackbarProvider>
    , document.getElementById('root'));

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: http://bit.ly/CRA-PWA
serviceWorker.unregister();
