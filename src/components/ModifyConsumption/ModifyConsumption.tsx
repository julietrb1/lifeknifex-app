import React from 'react';
import ConsumptionForm from "../common/ConsumptionForm/ConsumptionForm";
import HeaderBar from "../HeaderBar/HeaderBar";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import {RouteComponentProps} from "react-router";

const sections = [
    {name: 'Nutrition', href: '/nutrition'},
    {name: 'Edit'}
];

interface IModifyConsumptionMatchParams {
    consumptionId: string;
}

interface IModifyConsumptionProps extends RouteComponentProps<IModifyConsumptionMatchParams> {
    sections: any[] // TODO: Type this properly
}

const ModifyConsumption: React.FC<IModifyConsumptionProps> = props => {
    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title="Edit Consumption" icon='nutrition'/>
        <ConsumptionForm consumptionId={props.match.params.consumptionId}/>
    </div>;
};

export default ModifyConsumption;