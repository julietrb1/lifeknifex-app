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
import {firstCase} from "../../Utils";

class GoalAnswer extends RequestComponent {
    constructor(props) {
        super(props);
        const queryParams = new URLSearchParams(props.location.search);

        this.state = {
            currentGoal: null,
            currentGoalIndex: -1,
            done: false,
            candidateValue: null,
            isPostMode: queryParams.get('mode') === 'post',
            filteredGoals: null
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
                        `Did I ${firstCase(this.state.currentGoal.question)}?` :
                        'Loading Goal...'}
                </Header>
                <this.FormContent/>
            </Form>;
        }
    };

    handleSubmit = () => {
        const haveSingleGoal = !!this.props.match.params.goalId;
        const goalAnswered = !!this.state.currentGoal.todays_answer;
        if (haveSingleGoal && goalAnswered || this.state.isPostMode) {
            updateAnswer(this.cancelToken, this.state.currentGoal, this.state.candidateValue)
                .then(() => {
                    if (this.state.isPostMode) {
                        this.goToNextGoal();
                    } else {
                        this.props.history.goBack();
                    }
                });
        } else if (haveSingleGoal) {
            createAnswer(this.cancelToken, {
                goal: this.state.currentGoal.url,
                value: this.state.candidateValue
            }).then(this.props.history.goBack);
        }
    };

    FormContent = () => {
        if (this.props.isLoading || !this.state.currentGoal) {
            return <PlaceholderSet/>;
        } else if (this.state.isPostMode || this.props.match.params.goalId) {
            return <AnswerPost goal={this.state.currentGoal} onAnswer={this.handleChangePostAnswer}
                               checkedValue={this.state.candidateValue}
                               mode={this.state.isPostMode ? 'post' : 'single'}
                               isStart={this.state.currentGoalIndex === 0}
                               isEnd={this.state.filteredGoals &&
                               this.state.currentGoalIndex === this.state.filteredGoals.length - 1}/>;
        } else {
            return <AnswerPre goal={this.state.currentGoal} onAnswer={this.handlePreAnswer}/>;
        }
    };

    handleChangePostAnswer = candidateValue => this.setState({candidateValue});

    handlePreAnswer = answerValue => {
        createAnswer(this.cancelToken, {
            goal: this.state.currentGoal.url,
            value: answerValue
        }).then(this.goToNextGoal);
    };

    goToNextGoal = () => {
        if (!this.props.goals.results) {
            throw new Error('No goals');
        }

        let filteredGoals;
        const goalIdParam = this.props.match.params.goalId;
        if (!this.state.filteredGoals) {
            const today = moment().format(BACKEND_DATE_FORMAT);
            filteredGoals = this.props.goals.results.filter(goal => {
                const shouldStopPre = !goalIdParam && goal.last_answered !== today;
                const shouldStopPost = this.state.isPostMode || goalIdParam && goal.id === Number(goalIdParam);
                return shouldStopPost || shouldStopPre;
            });
            this.setState({filteredGoals});
        } else {
            filteredGoals = this.state.filteredGoals;
        }


        const newGoalIndex = this.state.currentGoalIndex + 1;
        if (newGoalIndex < this.props.goals.results.length) {
            const newGoal = filteredGoals[newGoalIndex];
            return this.setState({
                currentGoalIndex: newGoalIndex,
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