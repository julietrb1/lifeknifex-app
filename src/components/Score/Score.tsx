import React from 'react';
import HeaderBar from "../HeaderBar/HeaderBar";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";

const sections = [
    {name: 'Score'}
];

const Score = () => {
    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title="Score" icon='score'/>
    </div>;
};

export default Score;