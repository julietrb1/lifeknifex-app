import React from 'react';
import { Image } from 'semantic-ui-react';

export interface IFoodImageProps {
  icon: string;
}

const FoodImage: React.FC<IFoodImageProps> = ({ icon }: IFoodImageProps) => (icon
  ? <Image floated="right" size="mini" src={`/img/food_icons/${icon}.svg`} />
  : null);

export default FoodImage;
