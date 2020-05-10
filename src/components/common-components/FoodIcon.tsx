import React from 'react';
import {foodColors, foodIcons} from "../../Utils";
import {Icon} from "semantic-ui-react";

export interface IFoodIconProps {
    healthIndex: number;
}

const FoodIcon: React.FC<IFoodIconProps> = props => {
    return <Icon name={foodIcons[props.healthIndex - 1]} color={foodColors[props.healthIndex - 1]}/>;
};

export default FoodIcon;