import React from 'react';
import {Image} from "semantic-ui-react";
import PropTypes from 'prop-types';

const FoodImage = props => props.icon ?
    <Image floated='right' size='mini' src={`/img/food_icons/${props.icon}.svg`}/> :
    null;

FoodImage.propTypes = {
    icon: PropTypes.string
};

export default FoodImage;