import React from 'react';
import ConsumptionForm from "../common/ConsumptionForm/ConsumptionForm";
import HeaderBar from "../HeaderBar/HeaderBar";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";

const sections = [
    {name: 'Nutrition', href: '/nutrition'},
    {name: 'Log Consumption'}
];

const NutritionLog = () => {
    return <div className="nutrition-log">
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title="Log Consumption" icon='nutrition'/>
        <ConsumptionForm />
    </div>;
};

export default NutritionLog;