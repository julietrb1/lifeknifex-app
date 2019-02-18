import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {withRouter} from "react-router-dom";

import "react-datepicker/dist/react-datepicker.css";
import moment from "moment";

class GoalForm extends Component {
    constructor(props) {
        super(props);
        this.state = {
            goal: {
                question: '',
                test: 'atleast',
                frequency: 1,
                style: 'yesno',
                start_date: moment().subtract(1, 'day').format('YYYYMMDD')
            }
        };
    }


    render() {
        return (
            <div>

            </div>
        );
    }


}

GoalForm.propTypes = {
    goal: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
    onSubmit: PropTypes.func.isRequired,
    isLoading: PropTypes.bool.isRequired
};

export default withRouter(GoalForm);