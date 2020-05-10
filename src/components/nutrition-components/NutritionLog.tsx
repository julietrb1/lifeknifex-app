import React from 'react';
import ConsumptionForm from "./ConsumptionForm";
import HeaderBar from "../common-components/HeaderBar";
import BreadcrumbSet from "../common-components/BreadcrumbSet";

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