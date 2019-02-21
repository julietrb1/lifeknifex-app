import React from 'react';
import HeaderBar from "../HeaderBar/HeaderBar";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import {connect} from "react-redux";
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
import {Dispatch} from "redux";
import {IGoal, IGoalsStoreState} from "../../reducers/goals";
import {IPaginatedResponse} from "../../backend-common";

const sections = [
    {name: 'Goals'}
];

interface IGoalsStateProps {
    goalsResponse: IPaginatedResponse<IGoal>,
    goals: IGoalsStoreState,
    isLoading: boolean
}

interface IGoalsDispatchProps {
    fetchGoals: () => void;
}


type Props = IGoalsStateProps & IGoalsDispatchProps;

class Goals extends React.Component<Props> {

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
        const anyAnswered = Object.values(this.props.goals).some(goal => !!goal.todays_answer);
        const allAnswered = Object.values(this.props.goals).every(goal => !!goal.todays_answer);
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
            <CommonStatistic count={String(this.props.goalsResponse.count)} label='Goals'/>
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

function getGoalMeta(goal: IGoal) {
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

const GoalCard = (goal: IGoal) =>
    <Card key={goal.id} color={COLOR_GOALS}>
        <Card.Content>
            <Card.Header>{goal.question}</Card.Header>
            <Card.Meta>{getGoalMeta(goal)}</Card.Meta>
            <Card.Description>
                {LastAnswered(goal)}
            </Card.Description>
        </Card.Content>
        <Card.Content extra>
            <div>
                {AnswerButton(goal)}
                <Button size='tiny' basic as={Link} to={`/goals/manage/${goal.id}`}>Edit Goal</Button>
            </div>
        </Card.Content>
    </Card>;

const AnswerButton = (goal: IGoal) => {
    const isChange = goal.last_answered && moment().isSame(goal.last_answered, 'day');
    const url = `/goals/answer/${goal.id}`;
    return <Button size='tiny' basic as={Link} to={url} color={COLOR_GOALS}>
        {isChange ?
            'Change'
            : 'Log'} Answer
    </Button>;
};

const LastAnswered = (goal: IGoal) => {
    if (!goal.last_answered) {
        return <div>
            <Icon name='exclamation triangle' color='orange'/>
            Never answered
        </div>;
    } else if (moment().isSame(goal.last_answered, 'day')) {
        return <div>
            <Icon name='check circle' color='green'/>
            Answered today
        </div>;
    } else {
        const relativeMoment = getRelativeMoment(goal.last_answered);
        return <div>
            <Icon name='exclamation triangle' color='orange'/>
            Last answered {relativeMoment}
        </div>;
    }
};

const mapStateToProps = (state: any) => ({
    goals: state.goals,
    hasErrored: state.goalsHasErrored,
    isLoading: state.goalsIsLoading,
    goalsResponse: state.goalsResponse
});

const mapDispatchToProps = (dispatch: Dispatch<any>) => ({
    fetchGoals: () => dispatch(goalsFetchAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Goals);