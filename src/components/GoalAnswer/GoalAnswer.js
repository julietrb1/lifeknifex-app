import React, {Component} from 'react';
import PropTypes from 'prop-types';
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import HeaderBar from "../HeaderBar/HeaderBar";

class GoalAnswer extends Component {
    render() {
        const sections = [
            {name: 'Goals', href: '/goals'},
            {name: 'Answer'}
        ];
        return (
            <div>
                <BreadcrumbSet sections={sections}/>
                <HeaderBar title='Answer Goals' icon='goals'/>
            </div>
        );
    }
}

GoalAnswer.propTypes = {
    history: PropTypes.object.isRequired,
    match: PropTypes.object.isRequired
};

export default GoalAnswer;