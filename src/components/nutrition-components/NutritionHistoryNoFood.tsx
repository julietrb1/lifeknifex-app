import React from 'react';
import { Button, Icon, Image, Segment, } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { COLOR_NUTRITION } from '../../constants';

const NutritionHistoryNoFood = () => (
  <Segment textAlign="center" placeholder>
    <Image className="placeholder-image" src="/img/empty_jam_jar_orange.svg" size="small" />
    <h3>You need some food to log.</h3>
    <Button animated="vertical" as={Link} to="/nutrition/library/new" color={COLOR_NUTRITION}>
      <Button.Content visible>New Food</Button.Content>
      <Button.Content hidden>
        <Icon name="plus" />
      </Button.Content>
    </Button>
  </Segment>
);

export default NutritionHistoryNoFood;
