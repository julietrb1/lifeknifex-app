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
import {answersFetchAll} from "../../actions/answers";
import GoalsEmpty from "./GoalsEmpty/GoalsEmpty";

import './Goals.scss';
import CommonStatistic from "../common/CommonStatistic";

const sections = [
    {name: 'Goals'}
];

class Goals extends React.Component {

    componentDidMount() {
        this.props.fetchGoals();
        this.props.fetchAnswers();
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
                <AnsweringButton/>
            </div>
            <this.GoalsContent/>
        </div>;
    }

    DashboardContent = () => <div>
        <Statistic.Group>
            <CommonStatistic list={this.props.goals} label='Goal'/>
            <CommonStatistic list={this.props.answers} label='Answer'/>
            <Statistic>
                <Statistic.Value>22</Statistic.Value>
                <Statistic.Label>Consecutive Days</Statistic.Label>
            </Statistic>
            <Statistic>
                <Statistic.Value>9</Statistic.Value>
                <Statistic.Label>Days Since Answered</Statistic.Label>
            </Statistic>
        </Statistic.Group>
    </div>;

    GoalsContent = () => {
        if (this.props.isLoading) {
            return <PlaceholderSet/>;
        } else if (this.props.goals.results && this.props.goals.results.length) {
            return <Card.Group>
                {this.props.goals.results.map(GoalCard)}
            </Card.Group>;
        } else {
            return <GoalsEmpty/>;
        }
    };
}

const AnsweringButton = () => <Button
    color={COLOR_GOALS}
    as={Link}
    to='/goals/answer'
    animated='vertical'>
    <Button.Content visible>Start Answering</Button.Content>
    <Button.Content hidden>
        <Icon name='sticky note'/>
    </Button.Content>
</Button>;

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
            <Card.Header>{goal.question}?</Card.Header>
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
    const queryParams = new URLSearchParams();
    queryParams.set('goal', props.goal.id.toString());
    const url = `/goals/answer?${queryParams}`;
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
    fetchAnswers: PropTypes.func.isRequired,
    goals: PropTypes.object,
    answers: PropTypes.object,
    isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = state => ({
    goals: state.goals,
    hasErrored: state.goalsHasErrored,
    isLoading: state.goalsIsLoading,
    answers: state.answers
});

const mapDispatchToProps = dispatch => ({
    fetchGoals: () => dispatch(goalsFetchAll()),
    fetchAnswers: () => dispatch(answersFetchAll())
});

export default connect(mapStateToProps, mapDispatchToProps)(Goals);