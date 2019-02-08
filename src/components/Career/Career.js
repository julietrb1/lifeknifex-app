import React from 'react';
import HeaderBar from "../HeaderBar/HeaderBar";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";

const sections = [
    {name: 'Career'}
];

const Career = () => {
    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title="Career" icon='career'/>
    </div>;
};

export default Career;