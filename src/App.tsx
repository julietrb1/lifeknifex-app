import React from 'react';
import {Route, Router} from "react-router-dom";
import './App.scss';
import Nutrition from './components/nutrition-components/Nutrition';
import Goals from './components/goal-components/Goals';
import Account from './components/account-components/Account';
import Home from "./components/Home/Home";
import Login from "./components/account-components/Login";
import Register from "./components/account-components/Register";
import NutritionLog from "./components/nutrition-components/NutritionLog";
import NutritionLibrary from "./components/nutrition-components/NutritionLibrary";
import {Container, Divider} from "semantic-ui-react";
import ModifyConsumption from "./components/nutrition-components/ModifyConsumption";
import createBrowserHistory from 'history/createBrowserHistory';
import GoalNewEdit from "./components/goal-components/GoalForm";
import GoalAnswer from "./components/goal-components/GoalAnswer";
import FoodForm from "./components/nutrition-components/FoodForm";

export const history = createBrowserHistory();

class App extends React.Component {
    render() {
        return (
            <Router history={history}>
                <Container className='body-container'>
                    {/* Home */}
                    <Route exact path="/" component={Home}/>

                    {/* Nutrition */}
                    <Route exact path="/nutrition" component={Nutrition}/>
                    <Route exact path="/nutrition/library" component={NutritionLibrary}/>
                    <Route exact path="/nutrition/log" component={NutritionLog}/>
                    <Route exact path="/nutrition/library/new" component={FoodForm}/>
                    <Route path="/nutrition/library/manage/:foodId" component={FoodForm}/>
                    <Route path="/nutrition/history/:consumptionId" component={ModifyConsumption}/>

                    {/* Goals */}
                    <Route exact path="/goals" component={Goals}/>
                    <Route exact path="/goals/new" component={GoalNewEdit}/>
                    <Route exact path="/goals/manage/:goalId" component={GoalNewEdit}/>
                    <Route exact path="/goals/answer/:goalId?" component={GoalAnswer}/>

                    {/* Auth */}
                    <Route exact path="/account" component={Account}/>
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
            </Router>
        );
    }
}

export default App;
