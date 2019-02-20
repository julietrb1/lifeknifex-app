import React from 'react';
import PropTypes from 'prop-types';
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import HeaderBar from "../HeaderBar/HeaderBar";
import {connect} from "react-redux";
import {Form, Header} from "semantic-ui-react";
import PlaceholderSet from "../common/PlaceholderSet/PlaceholderSet";
import {goalCreateAnswer, goalsFetchAll, goalUpdateAnswer} from "../../actions/goals";
import RequestComponent from "../common/RequestComponent/RequestComponent";
import moment from "moment";
import {BACKEND_DATE_FORMAT} from "../../constants";
import GoalAnswerEmpty from "./GoalAnswerEmpty/GoalAnswerEmpty";
import AnswerPre from "./AnswerPre/AnswerPre";
import AnswerPost from "./AnswerPost/AnswerPost";
import {firstCase} from "../../Utils";

class GoalAnswer extends RequestComponent {
    constructor(props) {
        super(props);
        const queryParams = new URLSearchParams(props.location.search);

        this.state = {
            currentGoal: null,
            goalIndex: -1,
            done: false,
            candidateValue: null,
            isPostMode: queryParams.get('mode') === 'post',
            filteredGoals: null
        };
    }

    componentDidMount() {
        if (!Object.keys(this.props.goals).length) {
            this.props.fetchGoals();
        } else {
            this.goToGoal();
        }
    }

    componentDidUpdate(prevProps) {
        if (!Object.keys(prevProps.goals).length && Object.keys(this.props.goals).length) {

            this.goToGoal();
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
            const loading = this.props.isLoading || !this.state.filteredGoals;
            return <Form loading={loading} onSubmit={this.handleSubmit}>
                <Header>
                    {this.state.currentGoal ?
                        `Did I ${firstCase(this.state.currentGoal.question)}?` :
                        'Loading Goal...'}
                </Header>
                <this.FormContent/>
            </Form>;
        }
    };

    handleSubmit = (e, {increment}) => {
        const haveSingleGoal = !!this.props.match.params.goalId;
        const goalAnswered = !!this.state.currentGoal.todays_answer;
        if ((haveSingleGoal && goalAnswered) || this.state.isPostMode) {
            this.props.updateAnswer(this.state.currentGoal, this.state.candidateValue);
            if (this.state.isPostMode) {
                this.goToGoal(increment);
            } else {
                this.props.history.goBack();
            }
        } else if (haveSingleGoal) {
            this.props.createAnswer(this.state.currentGoal, this.state.candidateValue);
            this.props.history.goBack();
        }
    };

    FormContent = () => {
        if (this.props.isLoading || !this.state.currentGoal) {
            return <PlaceholderSet/>;
        } else if (this.state.isPostMode || this.props.match.params.goalId) {
            return <AnswerPost goal={this.state.currentGoal} onAnswer={this.handleChangePostAnswer}
                               checkedValue={this.state.candidateValue}
                               mode={this.state.isPostMode ? 'post' : 'single'}
                               isStart={this.state.goalIndex === 0}
                               isEnd={this.state.filteredGoals &&
                               this.state.goalIndex === this.state.filteredGoals.length - 1}
                               goBack={this.handleGoBack}/>;
        } else {
            return <AnswerPre goal={this.state.currentGoal} onAnswer={this.handlePreAnswer}/>;
        }
    };

    handleGoBack = () => this.handleSubmit(null, {increment: -1});

    handleChangePostAnswer = candidateValue => this.setState({candidateValue});

    handlePreAnswer = answerValue => {
        this.props.createAnswer(this.state.currentGoal, answerValue);
        this.goToGoal();
    };

    goToGoal = (increment = 1) => {
        if (!Object.keys(this.props.goals).length) {
            throw new Error('No goals');
        }

        if (typeof increment !== 'number') {
            increment = 1;
        }

        let filteredGoals;
        const goalIdParam = this.props.match.params.goalId;
        const today = moment().format(BACKEND_DATE_FORMAT);
        filteredGoals = Object.values(this.props.goals).filter(goal => {
            const shouldStopPre = !goalIdParam && goal.last_answered !== today;
            const shouldStopPost = this.state.isPostMode || (goalIdParam && goal.id === Number(goalIdParam));
            return shouldStopPost || shouldStopPre;
        });
        this.setState({filteredGoals});


        const newGoalIndex = this.state.goalIndex + increment;
        if (newGoalIndex < Object.values(filteredGoals).length) {
            const newGoal = filteredGoals[newGoalIndex];
            return this.setState({
                goalIndex: newGoalIndex,
                currentGoal: newGoal,
                candidateValue: newGoal.todays_answer_value
            });
        }

        if (goalIdParam) {
            this.props.history.replace('/goals');
        } else {
            this.setState({done: true});
        }
    };
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
    updateAnswer: (goal, value) => dispatch(goalUpdateAnswer(goal, value)),
    createAnswer: (goal, value) => dispatch(goalCreateAnswer(goal, value))
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalAnswer);