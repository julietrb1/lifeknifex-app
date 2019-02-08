import React from 'react';
import {foodColors, foodIcons} from "../../../Utils";
import {Icon} from "semantic-ui-react";
import PropTypes from 'prop-types';

const FoodIcon = props => {
    return <Icon name={foodIcons[props.healthIndex - 1]} color={foodColors[props.healthIndex - 1]}/>;
};

FoodIcon.propTypes = {
    healthIndex: PropTypes.number
};

export default FoodIcon;