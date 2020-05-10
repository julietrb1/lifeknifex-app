import React from 'react';
import {consumptionIcons, foodColors} from "../../Utils";
import {Icon} from "semantic-ui-react";

export interface IConsumptionIconProps {
    quantity: number;
}

const ConsumptionIcon: React.FC<IConsumptionIconProps> = props => <Icon name={consumptionIcons[props.quantity - 1]}
                                                                        color={foodColors[props.quantity - 1]}
                                                                        {...props}/>;

export default ConsumptionIcon;