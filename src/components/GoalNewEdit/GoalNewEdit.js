import React from 'react';
import {connect} from 'react-redux';
import PropTypes from 'prop-types';
import GoalForm from "../common/GoalForm/GoalForm";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import HeaderBar from "../HeaderBar/HeaderBar";
import {createGoal} from "../../Backend";
import RequestComponent from "../common/RequestComponent/RequestComponent";
import moment from "moment";

const mapStateToProps = state => ({});

const mapDispatchToProps = state => ({});

class GoalNewEdit extends RequestComponent {
    sections = [
        {name: 'Goals', href: '/goals'},
        {name: this.props.match.params.goalId ? 'Edit' : 'New'}
    ];

    constructor(props) {
        super(props);
        this.state = {
            goal: {
                question: '',
                test: 'atleast',
                frequency: 1,
                style: 'yesno',
                start_date: moment().subtract(1, 'day').format('YYYYMMDD')
            },
            isLoading: false
        };
    }

    render() {
        return (
            <div>
                <BreadcrumbSet sections={this.sections}/>
                <HeaderBar title="Goals" icon='goals'/>
                <GoalForm goal={this.props.match.params.goalId ? this.props.goal : this.state.goal}
                          onSubmit={this.handleGoalSubmit} isLoading={this.state.isLoading}/>
            </div>
        );
    }

    handleGoalSubmit = async goal => {
        this.setState({isLoading: true});
        if (!goal.id) {
            try {
                await createGoal(this.cancelToken, goal);
                this.props.history.goBack();
            } finally {
                this.setState({isLoading: false});
            }

        }
    };
}

GoalNewEdit.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            goalId: PropTypes.number
        })
    }),
    goal: PropTypes.object,
    history: PropTypes.object
};

export default connect(mapStateToProps, mapDispatchToProps)(GoalNewEdit);