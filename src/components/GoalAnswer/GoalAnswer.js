import React from 'react';
import PropTypes from 'prop-types';
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import HeaderBar from "../HeaderBar/HeaderBar";
import {connect} from "react-redux";
import {Form, Header} from "semantic-ui-react";
import PlaceholderSet from "../common/PlaceholderSet/PlaceholderSet";
import {goalsFetchAll} from "../../actions/goals";
import {createAnswer, updateAnswer} from "../../Backend";
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
            done: false,
            candidateValue: null
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
            return <Form loading={this.props.isLoading || this.state.isLoading} onSubmit={this.handleSubmit}>
                <Header>
                    {this.state.currentGoal ?
                        `${this.state.currentGoal.question}?` :
                        'Loading Goal...'}
                </Header>
                <this.FormContent/>
            </Form>;
        }
    };

    handleSubmit = () => {
        if (this.props.match.params.goalId) { // TODO: Handle post mode here
            updateAnswer(this.cancelToken, this.state.currentGoal, this.state.candidateValue)
                .then(this.props.history.goBack);
        }
    };

    FormContent = () => {
        if (this.props.isLoading || !this.state.currentGoal) {
            return <PlaceholderSet/>;
        } else if (this.props.match.params.goalId) {
            return <AnswerPost goal={this.state.currentGoal} onAnswer={this.handleChangePostAnswer}
                               checkedValue={this.state.candidateValue}/>;
        } else {
            return <AnswerPre goal={this.state.currentGoal} onAnswer={this.handlePreAnswer}/>;
        }
    };

    handleChangePostAnswer = candidateValue => this.setState({candidateValue});

    handlePreAnswer = answerValue => {
        const goalUrl = this.state.currentGoal.url;
        createAnswer(this.cancelToken, {
            goal: goalUrl,
            value: answerValue
        }).then(this.goToNextGoal);
    };

    goToNextGoal = () => {
        if (!this.props.goals.results) {
            throw new Error('No goals');
        }

        const goalIdParam = this.props.match.params.goalId;
        for (let i = this.state.currentGoalIndex + 1; i < this.props.goals.results.length; i++) {
            const newGoal = this.props.goals.results[i];
            const lastAnswered = newGoal.last_answered;
            const today = moment().format(BACKEND_DATE_FORMAT);
            const shouldStopPre = !goalIdParam && lastAnswered !== today;
            const shouldStopPost = goalIdParam && newGoal.id === Number(goalIdParam);
            if (shouldStopPost || shouldStopPre) {
                return this.setState({
                    currentGoalIndex: i,
                    currentGoal: newGoal,
                    candidateValue: newGoal.todays_answer_value
                });
            }
        }

        if (goalIdParam) {
            this.props.history.replace('/goals');
        } else {
            this.setState({done: true});
        }
    };

    componentDidUpdate(prevProps) {
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