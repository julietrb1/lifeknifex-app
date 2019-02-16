import React from 'react';
import PropTypes from 'prop-types';
import {Button, Card} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {healthStrings} from "../../../Utils";
import {COLOR_NUTRITION} from "../../../constants";
import FoodImage from "../../common/FoodImage/FoodImage";

const FoodList = props => <Card.Group centered>
    {props.foods.map(food =>
        <Card key={food.id}>
            <Card.Content>
                <FoodImage icon={food.icon}/>
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