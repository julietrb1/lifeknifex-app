import React from 'react';
import {Redirect, Route} from "react-router-dom";
import './App.scss';
import NutritionList from './components/nutrition-components/NutritionList';
import GoalList from './components/goal-components/GoalList';
import Account from './components/account-components/Account';
import Home from "./components/Home/Home";
import Login from "./components/account-components/Login";
import Register from "./components/account-components/Register";
import NutritionLibrary from "./components/nutrition-components/NutritionLibrary";
import {Container, Divider} from "semantic-ui-react";
import {createBrowserHistory} from 'history';
import GoalNewEdit from "./components/goal-components/GoalForm";
import Answer from "./components/goal-components/Answer";
import FoodForm from "./components/nutrition-components/FoodForm";
import ConsumptionForm from "./components/nutrition-components/ConsumptionForm";
import {useDispatch, useSelector} from "react-redux";
import {selectIsAuthenticated} from "./features/auth/authSelectors";
import axios, {AxiosError} from "axios";
import {fetchAccount, logOut} from "./features/auth/authSlice";
import {useSnackbar} from "notistack";

export const history = createBrowserHistory();

const App: React.FC = () => {
    const dispatch = useDispatch();
    const {enqueueSnackbar} = useSnackbar();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    if (isAuthenticated === null) dispatch(fetchAccount());

    axios.interceptors.response.use(function (response) {
        return response;
    }, function (error: AxiosError) {
        if (isAuthenticated !== false && error.response && !error.config.url?.includes('/api-auth/') && (error.response.status === 401 || error.response.status === 403)) {
            dispatch(logOut());
            enqueueSnackbar('Session expired - please log in again.', {variant: "warning"});
            throw new axios.Cancel('Session expired');
        }

        return Promise.reject(error);
    });

    // @ts-ignore
// TODO: Figure out parameter types
    const PrivateRoute = ({component: Component, ...rest}) => (
        <Route {...rest} render={(props) => (
            isAuthenticated !== false
                ? <Component {...props} />
                : <Redirect to={{
                    pathname: '/login',
                    state: {from: props.location}
                }}/>
        )}/>
    );

    return (

        <Container className='body-container'>
            {/* Home */}
            <PrivateRoute exact path="/" component={Home}/>

            {/* Nutrition */}
            <PrivateRoute exact path="/nutrition" component={NutritionList}/>
            <PrivateRoute exact path="/nutrition/library" component={NutritionLibrary}/>
            <PrivateRoute exact path="/nutrition/log" component={ConsumptionForm}/>
            <PrivateRoute exact path="/nutrition/library/new" component={FoodForm}/>
            <PrivateRoute path="/nutrition/library/manage/:foodId" component={FoodForm}/>
            <PrivateRoute path="/nutrition/history/:consumptionId" component={ConsumptionForm}/>

            {/* Goals */}
            <PrivateRoute exact path="/goals" component={GoalList}/>
            <PrivateRoute exact path="/goals/new" component={GoalNewEdit}/>
            <PrivateRoute exact path="/goals/manage/:goalId" component={GoalNewEdit}/>
            <PrivateRoute exact path="/goals/answer/:goalId?" component={Answer}/>

            {/* Auth */}
            <PrivateRoute exact path="/account" component={Account}/>
            <Route exact path="/login" component={Login}/>
            <Route exact path="/register" component={Register}/>

            {/* Page content */}
            <Divider hidden/>
            <div className="footer">
                <a href="https://www.djangoproject.com/fundraising/">
                    <img src="/img/django-hero.png" alt="Django Hero badge"/>
                </a>
                <a href="http://www.djangoproject.com/">
                    <img src="https://www.djangoproject.com/m/img/badges/djangopowered126x54_grey.gif"
                         alt="Powered by Django." title="Powered by Django."/>
                </a>
                <p>
                    <small>Images include content from <a href="https://icons8.com">Icons8</a> used under <a
                        href="https://creativecommons.org/licenses/by-nd/3.0/">CC BY-ND 3.0</a></small>
                </p>
            </div>
        </Container>
    );
};

export default App;
