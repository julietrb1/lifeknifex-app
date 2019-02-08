import React from 'react';
import HeaderBar from "../HeaderBar/HeaderBar";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";

const sections = [
    {name: 'Goals'}
];

const Goals = () => {
    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title="Goals" icon='goals'/>
    </div>;
};

export default Goals;