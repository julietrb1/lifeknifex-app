import React from 'react';
import PropTypes from 'prop-types';
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import HeaderBar from "../HeaderBar/HeaderBar";
import {connect} from "react-redux";
import {Form, Header} from "semantic-ui-react";
import PlaceholderSet from "../common/PlaceholderSet/PlaceholderSet";
import {goalsFetchAll} from "../../actions/goals";
import {createAnswer} from "../../Backend";
import RequestComponent from "../common/RequestComponent/RequestComponent";
import moment from "moment";
import {BACKEND_DATE_FORMAT} from "../../constants";
import GoalAnswerEmpty from "./GoalAnswerEmpty/GoalAnswerEmpty";
import AnswerPre from "./AnswerPre/AnswerPre";
import AnswerPost from "./AnswerPost/AnswerPost";

class GoalAnswer extends RequestComponent {
    constructor(props) {
        super(props);
        this.state = {
            currentGoal: null,
            currentGoalIndex: -1,
            done: false
        };
    }

    componentDidMount() {
        if (!this.props.goals.results) {
            this.props.fetchGoals();
        } else {
            this.goToNextGoal();
        }
    }

    render() {
        const sections = [
            {name: 'Goals', href: '/goals'},
            {name: 'Answer'}
        ];
        return <div>
            <BreadcrumbSet sections={sections}/>
            <HeaderBar title='Answer Goals' icon='goals'/>
            <this.PageContent/>
        </div>;
    }

    PageContent = () => {
        if (this.state.done) {
            return <GoalAnswerEmpty/>;
        } else {
            return <Form loading={this.props.isLoading}>
                <Header>
                    {this.state.currentGoal ?
                        `${this.state.currentGoal.question}?` :
                        'Loading Goal...'}
                </Header>
                <this.FormContent/>
            </Form>;
        }
    };

    FormContent = () => {
        if (this.props.isLoading || !this.state.currentGoal) {
            return <PlaceholderSet/>;
        } else if (this.props.match.params.goalId) {
            return <AnswerPost goal={this.state.currentGoal} onAnswer={this.handleAnswer}/>;
        } else {
            return <AnswerPre goal={this.state.currentGoal} onAnswer={this.handleAnswer}/>;
        }
    };

    handleAnswer = answerValue => {
        const goalUrl = this.state.currentGoal.url;
        createAnswer(this.cancelToken, {
            goal: goalUrl,
            value: answerValue
        }).then(this.goToNextGoal);
    };

    goToNextGoal = () => {
        const shouldSkipAnswered = !this.props.match.params.goalId;
        if (!this.props.goals.results) {
            throw new Error('No goals');
        }

        for (let i = 1; i < this.props.goals.results.length; i++) {
            const currentGoalIndex = this.state.currentGoalIndex;
            const newGoalIndex = currentGoalIndex + i;
            const newGoal = this.props.goals.results[newGoalIndex];
            const lastAnswered = newGoal.last_answered;
            const today = moment().format(BACKEND_DATE_FORMAT);
            if (lastAnswered !== today || !shouldSkipAnswered) {
                return this.setState({
                    currentGoalIndex: newGoalIndex,
                    currentGoal: newGoal
                });
            }
        }

        this.setState({done: true});
    };

    componentDidUpdate(prevProps, prevState) {
        if (!prevProps.goals.results && this.props.goals.results) {
            this.goToNextGoal();
        }
    }
}

GoalAnswer.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    fetchGoals: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    currentGoal: PropTypes.object,
    goals: PropTypes.object
};

const mapStateToProps = state => ({
    hasErrored: state.goalsHasErrored || state.answersHasErrored,
    isLoading: state.goalsIsLoading || state.answersIsLoading,
    goals: state.goals,
});

const mapDispatchToProps = dispatch => ({
    fetchGoals: () => dispatch(goalsFetchAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalAnswer);