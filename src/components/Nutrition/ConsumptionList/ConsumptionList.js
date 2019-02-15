import React from 'react';
import moment from "moment";
import PropTypes from "prop-types";
import {Divider, Header, List} from "semantic-ui-react";
import {consumptionSizes} from "../../../Utils";
import ConsumptionIcon from "../../common/ConsumptionIcon/ConsumptionIcon";
import {Link} from "react-router-dom";
import {TIME_FORMAT_STRING} from "../../../constants";

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
                    <Divider hidden/>
                    <Header sub>{moment(dateString).format('ddd D MMM gg')}</Header>
                    <Divider hidden/>
                    <List relaxed selection>
                        {consumptionItemsByDate[dateString].map(item =>
                            <List.Item key={item.id} as={Link} to={`/nutrition/history/${item.id}`}>
                                <ConsumptionIcon quantity={item.quantity}/>
                                <List.Content>
                                    <List.Header>{item.foodName}</List.Header>
                                    <List.Description>{consumptionSizes[item.quantity - 1]}&emsp;&bull;&emsp;{item.date.format(TIME_FORMAT_STRING)}</List.Description>
                                </List.Content>
                            </List.Item>
                        )}
                    </List>
                </div>
            )
        }
    </div>;
};

ConsumptionList.propTypes = {
    consumptionItems: PropTypes.array
};

export default ConsumptionList;