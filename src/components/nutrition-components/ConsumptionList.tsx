import React from 'react';
import moment from "moment";
import {Card, Divider, Header, Label} from "semantic-ui-react";
import {consumptionSizes, getRelativeMoment} from "../../Utils";
import {Link} from "react-router-dom";
import {COLOR_NUTRITION, TIME_FORMAT_STRING} from "../../constants";
import FoodImage from "../common-components/FoodImage";

interface IConsumptionListProps {
    consumptionItems: any[];
}

const ConsumptionList: React.FC<IConsumptionListProps> = (props) => {
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
                        <Header sub>{getRelativeMoment(dateString)}</Header>
                    </Divider>

                    <Divider hidden/>
                    <Card.Group>
                        {consumptionItemsByDate[dateString].map((item: any) => // TODO: Add consumption type
                            <Card key={item.id} as={Link} to={`/nutrition/history/${item.id}`} color={COLOR_NUTRITION}>
                                <Card.Content>
                                    <FoodImage icon={item.food_icon}/>
                                    <Card.Header>{item.food_name}</Card.Header>
                                    <Card.Meta><Label
                                        size='small'>{consumptionSizes[item.quantity - 1]}</Label>&emsp;{item.date.format(TIME_FORMAT_STRING)}
                                    </Card.Meta>
                                </Card.Content>
                            </Card>
                        )}
                    </Card.Group>
                    <Divider hidden/>
                </div>
            )
        }
    </div>;
};

export default ConsumptionList;