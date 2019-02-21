import React from 'react';
import HeaderBar from "../HeaderBar/HeaderBar";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import {connect} from "react-redux";
import PropTypes from 'prop-types';
import {goalsFetchAll} from "../../actions/goals";
import {Button, Card, Divider, Header, Icon, Statistic} from "semantic-ui-react";
import {COLOR_GOALS} from "../../constants";
import PlaceholderSet from "../common/PlaceholderSet/PlaceholderSet";
import {Link} from "react-router-dom";
import moment from 'moment-timezone';
import {getRelativeMoment} from "../../Utils";
import GoalsEmpty from "./GoalsEmpty/GoalsEmpty";

import './Goals.scss';
import CommonStatistic from "../common/CommonStatistic";

const sections = [
    {name: 'Goals'}
];

class Goals extends React.Component {

    componentDidMount() {
        if (!this.props.goalsResponse.results) {
            this.props.fetchGoals();
        }
    }

    render() {
        return <div>
            <BreadcrumbSet sections={sections}/>
            <HeaderBar title="Goals" icon='goals'/>

            <Divider horizontal>
                <Header as='h4'>Dashboard</Header>
            </Divider>
            <this.DashboardContent/>

            <Divider hidden/>

            <Divider horizontal>
                <Header as='h4'>Goal Library</Header>
            </Divider>
            <div className='goal-actions'>
                <NewButton/>
                <this.AnsweringButton/>
            </div>
            <this.GoalsContent/>
        </div>;
    }

    AnsweringButton = () => {
        const anyAnswered = Object.values(this.props.goals).some(goal => goal.todays_answer);
        const allAnswered = Object.values(this.props.goals).every(goal => goal.todays_answer);
        let url, text;
        if (allAnswered) {
            url = '/goals/answer?mode=post';
            text = 'Change Answers';
        } else if (anyAnswered) {
            url = '/goals/answer';
            text = 'Continue Answering';
        } else {
            url = '/goals/answer';
            text = 'Start Answering';
        }

        return <Button
            color={COLOR_GOALS}
            as={Link}
            to={url}
            animated='vertical'>
            <Button.Content visible>{text}</Button.Content>
            <Button.Content hidden>
                <Icon name='sticky note'/>
            </Button.Content>
        </Button>;
    };

    DashboardContent = () => <div>
        <Statistic.Group>
            <CommonStatistic count={this.props.goalsResponse.count} label='Goals'/>
            <CommonStatistic count={this.getGoalToAnswerCount()} label='To answer'/>
        </Statistic.Group>
    </div>;

    getGoalToAnswerCount() {
        return Object.values(this.props.goals).filter(goal => !goal.todays_answer).length;
    }

    GoalsContent = () => {
        if (this.props.isLoading) {
            return <PlaceholderSet/>;
        } else if (Object.keys(this.props.goals).length) {
            return <Card.Group stackable>
                {Object.values(this.props.goals).map(GoalCard)}
            </Card.Group>;
        } else {
            return <GoalsEmpty/>;
        }
    };
}

function getGoalMeta(goal) {
    const {test, frequency} = goal;
    switch (test) {
        case 'atleast':
            if (frequency === 1) {
                return 'Every day';
            } else {
                return `At least every ${frequency} days`;
            }
        case 'nomore':
            if (frequency === 1) {
                return 'No more than every day';
            } else {
                return `No more than every ${frequency} days`;
            }
        case 'never':
            return 'Never';
        default:
            return 'Invalid goal target';
    }
}

const NewButton = () => <Button
    basic
    as={Link}
    to='/goals/new'
    animated='vertical'>
    <Button.Content visible>New Goal</Button.Content>
    <Button.Content hidden>
        <Icon name='plus'/>
    </Button.Content>
</Button>;

const GoalCard = goal =>
    <Card key={goal.id} color={COLOR_GOALS}>
        <Card.Content>
            <Card.Header>{goal.question}</Card.Header>
            <Card.Meta>{getGoalMeta(goal)}</Card.Meta>
            <Card.Description>
                <LastAnswered goal={goal}/>
            </Card.Description>
        </Card.Content>
        <Card.Content extra>
            <div>
                <AnswerButton goal={goal}/>
                <Button size='tiny' basic as={Link} to={`/goals/manage/${goal.id}`}>Edit Goal</Button>
            </div>
        </Card.Content>
    </Card>;

const AnswerButton = props => {
    const isChange = props.goal.last_answered && moment().isSame(props.goal.last_answered, 'day');
    const url = `/goals/answer/${props.goal.id}`;
    return <Button size='tiny' basic as={Link} to={url} color={COLOR_GOALS}>
        {isChange ?
            'Change'
            : 'Log'} Answer
    </Button>;
};

AnswerButton.propTypes = {
    goal: PropTypes.shape({
        last_answered: PropTypes.string,
        id: PropTypes.number.isRequired
    })
};

const LastAnswered = props => {
    if (!props.goal.last_answered) {
        return <div>
            <Icon name='exclamation triangle' color='orange'/>
            Never answered
        </div>;
    } else if (moment().isSame(props.goal.last_answered, 'day')) {
        return <div>
            <Icon name='check circle' color='green'/>
            Answered today
        </div>;
    } else {
        const relativeMoment = getRelativeMoment(props.goal.last_answered);
        return <div>
            <Icon name='exclamation triangle' color='orange'/>
            Last answered {relativeMoment}
        </div>;
    }
};

Goals.propTypes = {
    fetchGoals: PropTypes.func.isRequired,
    goals: PropTypes.object,
    isLoading: PropTypes.bool.isRequired,
    goalsResponse: PropTypes.object
};

const mapStateToProps = (state) => ({
    goals: state.goals,
    hasErrored: state.goalsHasErrored,
    isLoading: state.goalsIsLoading,
    goalsResponse: state.goalsResponse
});

const mapDispatchToProps = dispatch => ({
    fetchGoals: () => dispatch(goalsFetchAll()),
});

export default connect<IGoalsDispatchProps, IGoalsStateProps>(mapStateToProps, mapDispatchToProps)(Goals);