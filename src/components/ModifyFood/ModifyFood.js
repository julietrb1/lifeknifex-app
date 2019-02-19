import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar';
import PropTypes from "prop-types";
import ModifyFoodForm from "../common/ModifyFoodForm/ModifyFoodForm";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";

const sections = [
    {name: 'Nutrition', href: '/nutrition'},
    {name: 'Food Library', href: '/nutrition/library'},
    {name: 'Edit'}
];

class ModifyFood extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            foodId: this.props.match.params.foodId
        };
    }

    render() {
        return (
            <div className='modify-food'>
                <BreadcrumbSet sections={sections}/>
                <HeaderBar
                    title='Edit Food'
                    icon='nutrition'/>
                <ModifyFoodForm foodId={this.state.foodId}/>
            </div>
        );
    }
}

ModifyFood.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            foodId: PropTypes.string
        })
    })
};

export default ModifyFood;