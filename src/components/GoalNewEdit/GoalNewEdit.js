import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import HeaderBar from "../HeaderBar/HeaderBar";
import RequestComponent from "../common/RequestComponent/RequestComponent";
import moment from "moment";
import {Button, Divider, Form, Input, Label, Radio} from "semantic-ui-react";
import DatePicker from "react-datepicker";

import './GoalNewEdit.scss';
import 'react-datepicker/dist/react-datepicker.min.css';
import {BACKEND_DATE_FORMAT} from "../../constants";
import {firstCase} from "../../Utils";
import {goalCreate, goalsFetchOne, goalUpdate} from "../../actions/goals";

class GoalNewEdit extends RequestComponent {
    constructor(props) {
        super(props);

        this.state = {
            goal: {
                question: '',
                test: 'atleast',
                frequency: 1,
                style: 'yesno',
                start_date: moment().format(BACKEND_DATE_FORMAT)
            },
            actionWord: props.match.params.goalId ? 'Edit' : 'New'
        };
    }

    componentDidMount() {
        const goalId = Number(this.props.match.params.goalId);
        if (!goalId) {
            return;
        }

        const goal = Object.values(this.props.goals).find(goal => goal.id === goalId);
        if (goal) {
            this.setState({goal});
        } else {
            this.props.fetchGoal(goalId);
        }
    }

    componentDidUpdate(prevProps) {
        const goalId = Number(this.props.match.params.goalId);
        const previousGoal = Object.values(prevProps.goals).find(goal => goal.id === goalId);
        const goal = Object.values(this.props.goals).find(goal => goal.id === goalId);
        if (!previousGoal && goal) {
            this.setState({goal});
        }
    }

    render() {
        const testInputLabel = `day${this.state.goal.frequency !== 1 ? 's' : ''}`;
        const sections = [
            {name: 'Goals', href: '/goals'},
            {name: this.state.actionWord}
        ];
        return (
            <div>
                <BreadcrumbSet sections={sections}/>
                <HeaderBar title={`${this.state.actionWord} Goal`} icon='goals'/>
                <Form onSubmit={this.handleGoalSubmit} loading={this.props.isLoading}>
                    <Form.Field required>
                        <label>Question</label>
                        <Input type='text' onChange={this.onChange('question')}
                               placeholder='Get to bed on time last night'
                               value={this.state.goal.question} label={{basic: true, content: '?'}}
                               labelPosition='right'>
                            <Label>Did I</Label>
                            <input/>
                            <Label>?</Label>
                        </Input>
                    </Form.Field>
                    <Form.Field required>
                        <label>Test</label>
                    </Form.Field>
                    <Form.Field inline>
                        <Radio label='At least every' name='goal-test' value='atleast'
                               checked={this.state.goal.test === 'atleast'} onChange={this.onChange('test')}/>
                        <Input type='number' value={this.state.goal.frequency} className='frequency-input'
                               onChange={this.onChange('frequency')} label={{basic: true, content: testInputLabel}}
                               labelPosition='right' disabled={this.state.goal.test !== 'atleast'}/>
                    </Form.Field>
                    <Form.Field inline>
                        <Radio label='No more than every' name='goal-test' value='nomore'
                               checked={this.state.goal.test === 'nomore'} onChange={this.onChange('test')}/>
                        <Input type='number' value={this.state.goal.frequency}
                               onChange={this.onChange('frequency')}
                               label={{basic: true, content: testInputLabel}} className='frequency-input'
                               labelPosition='right' disabled={this.state.goal.test !== 'nomore'}/>
                    </Form.Field>
                    <Form.Field>
                        <Radio label='Never' name='goal-test' value='never' checked={this.state.goal.test === 'never'}
                               onChange={this.onChange('test')}/>
                    </Form.Field>
                    <Divider hidden/>

                    <Form.Field required>
                        <label>Style</label>
                    </Form.Field>
                    <Form.Field>
                        <Radio label='Yes/No' name='goal-style' value='yesno'
                               checked={this.state.goal.style === 'yesno'}
                               onChange={this.onChange('style')}/>
                    </Form.Field>
                    <Form.Field>
                        <Radio label='Likert' name='goal-style' value='likert'
                               checked={this.state.goal.style === 'likert'}
                               onChange={this.onChange('style')}/>
                    </Form.Field>
                    <Divider hidden/>

                    <Form.Field required>
                        <label>Start Date</label>
                    </Form.Field>
                    <Form.Field>
                        <DatePicker dropdownMode='select' onChange={this.onDateChange}
                                    selected={this.state.goal.start_date} dateFormat='dd/MM/yyyy'/>
                    </Form.Field>

                    <Divider hidden/>
                    <Button.Group>
                        <Button type='button' onClick={this.props.history.goBack}>Back</Button>
                        <Button.Or/>
                        <Button positive type="submit" disabled={!this.isFormValid()}>Save Goal</Button>
                    </Button.Group>
                </Form>
            </div>
        );
    }

    onChange = field => (e, {value}) =>
        this.setState(prevState => ({
            goal: {
                ...prevState.goal,
                [field]: value
            }
        }));

    isFormValid = () => !!(
        this.state.goal &&
        this.state.goal.question && this.state.goal.question.length >= 3 &&
        this.state.goal.test &&
        this.state.goal.style &&
        this.state.goal.start_date
    );

    onDateChange = date => this.setState(prevState => ({
        goal: {
            ...prevState.goal,
            date: moment(date).format(BACKEND_DATE_FORMAT)
        }
    }));

    handleGoalSubmit = () => {
        const goal = this.state.goal;
        goal.question = goal.question.replace(/(\?+)$/g, '');
        goal.question = goal.question.replace(/^((Did I)|(Have I))\s+/gi, '');
        goal.question = firstCase(goal.question, true);

        try {
            if (goal.id) {
                this.props.updateGoal(goal);
            } else {
                this.props.createGoal(goal);
            }
            this.props.history.goBack();
        } finally {
        }
    };
}

GoalNewEdit.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            goalId: PropTypes.string
        })
    }),
    history: PropTypes.object
};

const mapStateToProps = state => ({
    goals: state.goals
});

const mapDispatchToProps = dispatch => ({
    createGoal: goal => dispatch(goalCreate(goal)),
    updateGoal: goal => dispatch(goalUpdate(goal)),
    fetchGoal: goalId => dispatch(goalsFetchOne(goalId)),
});

export default connect(mapStateToProps, mapDispatchToProps)(GoalNewEdit);