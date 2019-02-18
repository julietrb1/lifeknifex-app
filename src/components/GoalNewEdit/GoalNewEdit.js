import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import HeaderBar from "../HeaderBar/HeaderBar";
import {createGoal, getGoal, updateGoal} from "../../Backend";
import RequestComponent from "../common/RequestComponent/RequestComponent";
import moment from "moment";
import {Button, Divider, Form, Input, Radio} from "semantic-ui-react";
import DatePicker from "react-datepicker";

import './GoalNewEdit.scss';
import 'react-datepicker/dist/react-datepicker.min.css';

const mapStateToProps = state => ({});

const mapDispatchToProps = state => ({});

class GoalNewEdit extends RequestComponent {
    constructor(props) {
        super(props);

        this.state = {
            goal: {
                question: '',
                test: 'atleast',
                frequency: 1,
                style: 'yesno',
                start_date: moment().format('YYYY-MM-DD')
            },
            isLoading: false,
            actionWord: props.match.params.goalId ? 'Edit' : 'New'
        };
    }

    async componentDidMount() {
        const goalId = this.props.match.params.goalId;
        if (!goalId) {
            return;
        }
        this.setState({isLoading: true});
        const goal = await getGoal(this.cancelToken, goalId);
        this.setState({
            goal,
            isLoading: false
        });
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
                <Form onSubmit={this.handleGoalSubmit} loading={this.state.isLoading}>
                    <Form.Field required>
                        <label>Question</label>
                        <Input type='text' onChange={this.onChange('question')}
                               placeholder='e.g. Did I get to bed on time last night'
                               value={this.state.goal.question} label={{basic: true, content: '?'}}
                               labelPosition='right'/>
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
        this.state.goal.question && this.state.goal.question.length > 10 &&
        this.state.goal.test &&
        this.state.goal.style &&
        this.state.goal.start_date
    );

    onDateChange = date => this.setState(prevState => ({
        goal: {
            ...prevState.goal,
            date: moment(date).format('YYYY-MM-DD')
        }
    }));

    handleGoalSubmit = async () => {
        this.setState({isLoading: true});

        try {
            if (this.state.goal.id) {
                await updateGoal(this.cancelToken, this.state.goal);
            } else {
                await createGoal(this.cancelToken, this.state.goal);
            }
            this.props.history.goBack();
        } finally {
            this.setState({isLoading: false});
        }
    };
}

GoalNewEdit.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            goalId: PropTypes.string
        })
    }),
    goal: PropTypes.object,
    history: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalNewEdit);