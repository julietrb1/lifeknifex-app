import React from 'react';
import PropTypes from 'prop-types';
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import HeaderBar from "../HeaderBar/HeaderBar";
import {connect} from "react-redux";
import {answersFetchAll} from "../../actions/answers";
import {Form, Header, Radio} from "semantic-ui-react";
import PlaceholderSet from "../common/PlaceholderSet/PlaceholderSet";
import {goalsFetchAll} from "../../actions/goals";
import {createAnswer} from "../../Backend";
import RequestComponent from "../common/RequestComponent/RequestComponent";
import moment from "moment";
import {BACKEND_DATE_FORMAT} from "../../constants";
import GoalAnswerEmpty from "./GoalAnswerEmpty/GoalAnswerEmpty";

class GoalAnswer extends RequestComponent {
    constructor(props) {
        super(props);
        const queryParams = new URLSearchParams(this.props.location.search);
        const goalId = queryParams.get('goal');
        this.state = {
            currentGoal: null,
            currentGoalIndex: -1,
            goalId,
            done: false
        };
    }

    componentDidMount() {
        this.props.fetchGoals();
        this.props.fetchAnswers();
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
        const queryParams = new URLSearchParams(this.props.location.search);
        const mode = queryParams.get('mode');
        if (this.props.isLoading) {
            return <PlaceholderSet/>;
        } else if (mode === 'post') {
            return <this.AnswerPost/>;
        } else {
            return <this.AnswerPre/>;
        }
    };

    AnswerPre = () => {
        if (!this.state.currentGoal) {
            return null;
        } else if (this.state.currentGoal.style === 'yesno') {
            return <div>
                <Form.Button fluid basic positive onClick={() => this.handleAnswer(1)}>Yes</Form.Button>
                <Form.Button fluid basic negative onClick={() => this.handleAnswer(2)}>No</Form.Button>
            </div>;
        } else {
            return <div>
                <Form.Button fluid basic positive onClick={() => this.handleAnswer(1)}>Effectively</Form.Button>
                <Form.Button fluid basic onClick={() => this.handleAnswer(2)}>Adequately</Form.Button>
                <Form.Button fluid basic onClick={() => this.handleAnswer(3)}>Poorly</Form.Button>
                <Form.Button fluid basic negative onClick={() => this.handleAnswer(4)}>Unsuccessfully</Form.Button>
            </div>;
        }
    };

    AnswerPost = () => {
        if (!this.state.currentGoal) {
            return null;
        } else if (this.state.currentGoal.style === 'yesno') {
            return <Form.Group inline>
                <Form.Field
                    control={Radio}
                    label='Yes'
                    value='1'/>
                <Form.Field
                    control={Radio}
                    label='No'
                    value='2'/>
            </Form.Group>;
        } else {
            return <Form.Group inline>
                <Form.Field
                    control={Radio}
                    label='Effectively'
                    value='1'/>
                <Form.Field
                    control={Radio}
                    label='Adequately'
                    value='2'/>
                <Form.Field
                    control={Radio}
                    label='Poorly'
                    value='3'/>
                <Form.Field
                    control={Radio}
                    label='Unsuccessfully'
                    value='4'/>
            </Form.Group>;
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
        const shouldSkipAnswered = true; // TODO: set this by inference
        if (!this.props.goals.results) {
            return;
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

    componentDidUpdate(prevProps) {
        if (!prevProps.goals.results && this.props.goals.results) {
            const isPost = this.props.location.search.mode === 'post';
            this.goToNextGoal(!isPost);
        }
    }
}

GoalAnswer.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired,
    fetchAnswers: PropTypes.func.isRequired,
    fetchGoals: PropTypes.func.isRequired,
    location: PropTypes.object.isRequired,
    isLoading: PropTypes.bool.isRequired,
    currentGoal: PropTypes.object,
    goals: PropTypes.object
};

const mapStateToProps = state => ({
    hasErrored: state.answersHasErrored,
    isLoading: state.answersIsLoading,
    answers: state.answers,
    goals: state.goals,
});

const mapDispatchToProps = dispatch => ({
    fetchAnswers: () => dispatch(answersFetchAll()),
    fetchGoals: () => dispatch(goalsFetchAll())
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalAnswer);