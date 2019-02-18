import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {Button, Divider, Form, Input, Radio} from "semantic-ui-react";
import {withRouter} from "react-router-dom";
import DatePicker from "react-datepicker";

import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

class GoalForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goal: props.goal
        };
    }

    onChange = field => (e, {value}) =>
        this.setState(prevState => ({
            goal: {
                ...prevState.goal,
                [field]: value ? value : e
            }
        }));

    render() {
        const testInputLabel = `day${this.state.goal.frequency !== 1 ? 's' : ''}`;
        return (
            <div>
                <Form onSubmit={() => this.props.onSubmit(this.state.goal)}>
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
                        <Input type='number' value={this.state.goal.frequency}
                               onChange={this.onChange('frequency')} label={{basic: true, content: testInputLabel}}
                               labelPosition='right' disabled={this.state.goal.test !== 'atleast'}/>
                    </Form.Field>
                    <Form.Field inline>
                        <Radio label='No more than every' name='goal-test' value='nomore'
                               checked={this.state.goal.test === 'nomore'} onChange={this.onChange('test')}/>
                        <Input type='number' value={this.state.goal.frequency}
                               onChange={this.onChange('frequency')}
                               label={{basic: true, content: testInputLabel}}
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
                        <Button positive type="submit">Save Goal</Button>
                    </Button.Group>
                </Form>
            </div>
        );
    }

    onDateChange = date => this.onChange('start_date')(null, {value: moment(date).format('YYYY-MM-DD')});
}

GoalForm.propTypes = {
    goal: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired
};

export default withRouter(GoalForm);