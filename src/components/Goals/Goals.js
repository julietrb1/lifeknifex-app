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

const sections = [
    {name: 'Goals'}
];

class Goals extends React.Component {

    componentDidMount() {
        this.props.fetchData();
    }

    render() {
        return <div>
            <BreadcrumbSet sections={sections}/>
            <HeaderBar title="Goals" icon='goals'/>
            <Divider horizontal>
                <Header as='h4'>Dashboard</Header>
            </Divider>

            <Statistic.Group>
                <Statistic>
                    <Statistic.Value>{this.props.goals.count ? this.props.goals.count : 'No'}</Statistic.Value>
                    <Statistic.Label>Goal{this.props.goals.count && this.props.goals.count === 1 ? '' : 's'}</Statistic.Label>
                </Statistic>
                <Statistic>
                    <Statistic.Value>31,200</Statistic.Value>
                    <Statistic.Label>Answers</Statistic.Label>
                </Statistic>
                <Statistic>
                    <Statistic.Value>22</Statistic.Value>
                    <Statistic.Label>Consecutive Days</Statistic.Label>
                </Statistic>
                <Statistic>
                    <Statistic.Value>9</Statistic.Value>
                    <Statistic.Label>Days Since Answered</Statistic.Label>
                </Statistic>
            </Statistic.Group>

            <Divider hidden/>

            <Divider horizontal>
                <Header as='h4'>Goal Library</Header>
            </Divider>

            <this.GoalsContent/>
        </div>;
    }

    GoalsContent = () => {
        if (this.props.isLoading) {
            return <PlaceholderSet/>;
        } else if (this.props.goals.results && this.props.goals.results.length) {
            return <Card.Group>
                {this.props.goals.results.map(GoalCard)}
            </Card.Group>;
        } else {
            return 'None';
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

const GoalCard = (goal) =>
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
    return <Button size='tiny' basic as={Link} to={`/goals/answer?goal=${props.goal.id}`}
                   color={COLOR_GOALS}>{props.goal.last_answered && moment().isSame(props.goal.last_answered, 'day') ? 'Change' : 'Log'} Answer</Button>;
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
    fetchData: PropTypes.func.isRequired,
    goals: PropTypes.object,
    isLoading: PropTypes.bool.isRequired
};

const mapStateToProps = (state) => {
    return {
        goals: state.goals,
        hasErrored: state.goalsHasErrored,
        isLoading: state.goalsIsLoading
    };
};

const mapDispatchToProps = (dispatch) => {
    return {
        fetchData: () => dispatch(goalsFetchAll())
    };
};

export default connect(mapStateToProps, mapDispatchToProps)(Goals);