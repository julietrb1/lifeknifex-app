import React from 'react';
import {Image} from "semantic-ui-react";
import {IFoodImageProps} from "./IFoodImageProps";

const FoodImage: React.FC<IFoodImageProps> = props => props.icon ?
    <Image floated='right' size='mini' src={`/img/food_icons/${props.icon}.svg`}/> :
    null;

export default FoodImage;