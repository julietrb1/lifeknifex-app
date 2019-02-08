import React from 'react';
import ConsumptionForm from "../common/ConsumptionForm/ConsumptionForm";
import HeaderBar from "../HeaderBar/HeaderBar";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import PropTypes from "prop-types";

const sections = [
    {name: 'Nutrition', href: '/nutrition'},
    {name: 'Consumption History', href: '/nutrition/history'},
    {name: 'Modify'}
];

const ModifyConsumption = props => {
    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title="Edit Consumption" icon='nutrition'/>
        <ConsumptionForm consumptionId={props.match.params.consumptionId}/>
    </div>;
};

ModifyConsumption.propTypes = {
    match: PropTypes.shape({
        params: PropTypes.shape({
            consumptionId: PropTypes.string
        })
    })
};

export default ModifyConsumption;