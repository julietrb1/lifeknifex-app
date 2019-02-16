import React from 'react';
import moment from "moment";
import PropTypes from "prop-types";
import {Card, Divider, Header} from "semantic-ui-react";
import {consumptionSizes} from "../../../Utils";
import {Link} from "react-router-dom";
import {TIME_FORMAT_STRING} from "../../../constants";
import FoodImage from "../../common/FoodImage/FoodImage";

const ConsumptionList = (props) => {
    const consumptionItems = props.consumptionItems.map(item => {
        item.date = moment(item.date).local();
        return item;
    });

    const consumptionItemsByDate = consumptionItems.length ? consumptionItems.reduce((acc, item) => {
        const dateString = item.date.format('YYYYMMDD');
        if (typeof acc[dateString] === 'undefined') {
            acc[dateString] = [];
        }
        acc[dateString].push(item);
        return acc;
    }, {}) : [];

    return <div>
        {
            Object.keys(consumptionItemsByDate).sort().reverse().map(dateString =>
                <div key={dateString}>
                    <Divider horizontal>
                        <Header sub>{moment(dateString).calendar(null, {
                            sameDay: '[Today]',
                            nextDay: '[Tomorrow]',
                            nextWeek: 'dddd',
                            lastDay: '[Yesterday]',
                            lastWeek: '[Last] dddd',
                            sameElse: 'DD/MM/YYYY'
                        })}</Header>
                    </Divider>

                    <Divider hidden/>
                    <Card.Group>
                        {consumptionItemsByDate[dateString].map(item =>
                            <Card key={item.id} as={Link} to={`/nutrition/history/${item.id}`}>
                                <Card.Content>
                                    <FoodImage icon={item.food.icon}/>
                                    <Card.Header>{item.food.name}</Card.Header>
                                    <Card.Meta>{consumptionSizes[item.quantity - 1]}&emsp;&bull;&emsp;{item.date.format(TIME_FORMAT_STRING)}</Card.Meta>
                                </Card.Content>
                            </Card>
                        )}
                    </Card.Group>
                </div>
            )
        }
    </div>;
};

ConsumptionList.propTypes = {
    consumptionItems: PropTypes.array
};

export default ConsumptionList;