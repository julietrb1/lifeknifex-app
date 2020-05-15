import React from 'react';
import { Icon } from 'semantic-ui-react';
import { foodColors, foodIcons } from '../../Utils';

export interface IFoodIconProps {
  healthIndex: number;
}

const FoodIcon: React.FC<IFoodIconProps> = (
  { healthIndex }: IFoodIconProps,
) => <Icon name={foodIcons[healthIndex - 1]} color={foodColors[healthIndex - 1]} />;

export default FoodIcon;
