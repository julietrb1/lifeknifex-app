import React from 'react';
import PropTypes from 'prop-types';
import {Button, Card, Image} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {healthStrings} from "../../../Utils";
import {COLOR_NUTRITION} from "../../../constants";

const FoodList = props => <Card.Group centered>
    {props.foods.map(food =>
        <Card key={food.id}>
            <Card.Content>
                {food.icon ?
                    <Image floated='right' size='mini' src={`/img/food_icons/${food.icon}.svg`}/>
                    : ''}
                <Card.Header>{food.name}</Card.Header>
                <Card.Meta>{healthStrings[food.health_index - 1]}</Card.Meta>
            </Card.Content>
            <Card.Content extra>
                <div>
                    <Button basic color={COLOR_NUTRITION}>
                        Log
                    </Button>
                    <Button basic as={Link} to={`/nutrition/library/manage/${food.id}`}>
                        Edit
                    </Button>
                </div>
            </Card.Content>
        </Card>
    )}
</Card.Group>;

FoodList.propTypes = {
    foods: PropTypes.array.isRequired
};

export default FoodList;