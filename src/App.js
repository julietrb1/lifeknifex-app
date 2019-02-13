import React from 'react';
import {BrowserRouter as Router, Route} from "react-router-dom";
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

class App extends React.Component {
    render() {
        return (
            <Router>
                <Container className='body-container'>
                    <Route exact path="/" component={Home}/>
                    <Route exact path="/nutrition" component={Nutrition}/>
                    <Route exact path="/nutrition/library" component={NutritionLibrary}/>
                    <Route exact path="/nutrition/log" component={NutritionLog}/>
                    <Route exact path="/nutrition/library/new" component={NewFood}/>
                    <Route path="/nutrition/library/manage/:foodId" component={ModifyFood}/>
                    <Route path="/nutrition/history/:consumptionId" component={ModifyConsumption}/>
                    <Route exact path="/goals" component={Goals}/>
                    <Route exact path="/career" component={Career}/>
                    <Route exact path="/mood" component={Mood}/>
                    <Route exact path="/score" component={Score}/>
                    <Route exact path="/account" component={Account}/>
                    <Route exact path="/login" component={Login}/>
                    <Route exact path="/register" component={Register}/>

                    <Divider hidden/>
                    <p className="muted">
                        <small>Images include content from <a href="https://icons8.com">Icons8</a> used under <a
                            href="https://creativecommons.org/licenses/by-nd/3.0/">CC BY-ND 3.0</a></small>
                    </p>
                </Container>
            </Router>
        );
    }
}

export default App;
