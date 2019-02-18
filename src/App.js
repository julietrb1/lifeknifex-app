import React from 'react';
import {Route, Router} from "react-router-dom";
import './App.scss';
import Nutrition from './components/Nutrition/Nutrition';
import Goals from './components/Goals/Goals';
import Career from './components/Career/Career';
import Mood from './components/Mood/Mood';
import Score from './components/Score/Score';
import Account from './components/Account/Account';
import Home from "./components/Home/Home";
import Login from "./components/Login/Login";
import Register from "./components/Register/Register";
import NutritionLog from "./components/NutritionLog/NutritionLog";
import NutritionLibrary from "./components/NutritionLibrary/NutritionLibrary";
import ModifyFood from "./components/ModifyFood/ModifyFood";
import {Container, Divider} from "semantic-ui-react";
import NewFood from "./components/NewFood/NewFood";
import ModifyConsumption from "./components/ModifyConsumption/ModifyConsumption";
import createBrowserHistory from 'history/createBrowserHistory';
import GoalNewEdit from "./components/GoalNewEdit/GoalNewEdit";
import GoalAnswer from "./components/GoalAnswer/GoalAnswer";

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
                    <Route exact path="/nutrition/library/new" component={NewFood}/>
                    <Route path="/nutrition/library/manage/:foodId" component={ModifyFood}/>
                    <Route path="/nutrition/history/:consumptionId" component={ModifyConsumption}/>

                    {/* Goals */}
                    <Route exact path="/goals" component={Goals}/>
                    <Route exact path="/goals/new" component={GoalNewEdit}/>
                    <Route exact path="/goals/manage/:goalId" component={GoalNewEdit}/>
                    <Route exact path="/goals/answer" component={GoalAnswer}/>

                    {/* Career */}
                    <Route exact path="/career" component={Career}/>

                    {/* Mood */}
                    <Route exact path="/mood" component={Mood}/>

                    {/* Score */}
                    <Route exact path="/score" component={Score}/>

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
                                 border="0" alt="Powered by Django." title="Powered by Django."/>
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
