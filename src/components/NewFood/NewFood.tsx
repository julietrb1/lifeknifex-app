import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar';
import ModifyFoodForm from "../common/ModifyFoodForm/ModifyFoodForm";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";

const sections = [
    {name: 'Nutrition', href: '/nutrition'},
    {name: 'Food Library', href: '/nutrition/library'},
    {name: 'New'}
];

const NewFood = () => {
    return (
        <div>
            <BreadcrumbSet sections={sections}/>
            <HeaderBar
                title='New Food'
                icon='nutrition'/>
            <ModifyFoodForm/>
        </div>
    );
};

export default NewFood;