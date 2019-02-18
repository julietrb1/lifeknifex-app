import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import HeaderBar from "../HeaderBar/HeaderBar";
import {connect} from "react-redux";
import {answersFetchAll} from "../../actions/answers";
import {Form, Header} from "semantic-ui-react";
import PlaceholderSet from "../common/PlaceholderSet/PlaceholderSet";
import {goalsFetchAll} from "../../actions/goals";

class GoalAnswer extends Component {
    constructor(props) {
        super(props);
        this.state = {
            currentGoalIndex: 0
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
        return (
            <div>
                <BreadcrumbSet sections={sections}/>
                <HeaderBar title='Answer Goals' icon='goals'/>
                <Form loading={this.props.isLoading}>
                    <Header>
                        {this.props.goals.results ?
                            `${this.props.goals.results[this.state.currentGoalIndex].question}?` :
                            'Loading Goal...'}
                    </Header>
                    <this.FormContent/>
                </Form>
            </div>
        );
    }

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
        if (!this.props.goals.results) {
            return null;
        } else if (this.props.goals.results[this.state.currentGoalIndex].style === 'yesno') {
            return <div>
                <Form.Button fluid basic positive>Yes</Form.Button>
                <Form.Button fluid basic negative>No</Form.Button>
            </div>;
        } else {
            return <div>
                <Form.Button fluid basic positive>Effectively</Form.Button>
                <Form.Button fluid basic>Adequately</Form.Button>
                <Form.Button fluid basic>Poorly</Form.Button>
                <Form.Button fluid basic negative>Unsuccessfully</Form.Button>
            </div>;
        }
    };
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