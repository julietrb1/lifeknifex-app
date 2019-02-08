import React from 'react';
import PropTypes from 'prop-types';
import {List} from "semantic-ui-react";
import {Link} from "react-router-dom";
import {healthStrings} from "../../../Utils";
import FoodIcon from "../../common/FoodIcon/FoodIcon";

const FoodList = props => <List relaxed selection>
    {props.foods.map(food =>
        <List.Item key={food.id} as={Link} to={`/nutrition/library/manage/${food.id}`}>
            <FoodIcon healthIndex={food.healthIndex}/>
            <List.Content>
                <List.Header>{food.name}</List.Header>
                <List.Description>{healthStrings[food.healthIndex - 1]}</List.Description>
            </List.Content>
        </List.Item>
    )}
</List>;

FoodList.propTypes = {
    foods: PropTypes.array.isRequired
};

export default FoodList;