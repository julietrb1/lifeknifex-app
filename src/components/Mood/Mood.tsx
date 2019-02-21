import React from 'react';
import HeaderBar from "../HeaderBar/HeaderBar";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";

const sections = [
    {name: 'Mood'}
];

const Mood = () => {
    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title="Mood" icon='mood'/>
    </div>;
};

export default Mood;