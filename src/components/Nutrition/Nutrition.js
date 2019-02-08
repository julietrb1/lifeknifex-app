import React from 'react';
import {Link} from "react-router-dom";
import BreadcrumbSet from "../common/BreadcrumbSet/BreadcrumbSet";
import HeaderBar from "../HeaderBar/HeaderBar";
import {Card, Divider} from "semantic-ui-react";
import * as constants from '../../constants';

const sections = [
    {name: 'Nutrition'},
];

const Nutrition = () => {
    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title='Nutrition' icon='nutrition'/>
        <Divider hidden/>
        <Card.Group centered>
            <Card
                header='Log Consumption'
                meta="Add foods you've eaten today"
                color={constants.COLOR_NUTRITION}
                to='/nutrition/log'
                as={Link}
            />
            <Card
                header='See History'
                meta="Review your nutrition records"
                color={constants.COLOR_NUTRITION}
                to='/nutrition/history'
                as={Link}
            />
            <Card
                header='Manage Library'
                meta="Add and modify foods previously registered"
                color={constants.COLOR_NUTRITION}
                to='/nutrition/library'
                as={Link}
            />
        </Card.Group>
    </div>;
};

export default Nutrition;