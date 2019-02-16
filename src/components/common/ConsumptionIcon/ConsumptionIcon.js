import React from 'react';
import {consumptionIcons, foodColors} from "../../../Utils";
import {Icon} from "semantic-ui-react";
import PropTypes from 'prop-types';

const ConsumptionIcon = props => <Icon name={consumptionIcons[props.quantity - 1]}
                                       color={foodColors[props.quantity - 1]}
                                       {...props}/>;

ConsumptionIcon.propTypes = {
    quantity: PropTypes.number
};

export default ConsumptionIcon;