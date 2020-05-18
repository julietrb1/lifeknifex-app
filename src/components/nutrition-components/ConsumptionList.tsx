import React from 'react';
import moment, { Moment } from 'moment';
import {
  Card, Divider, Header, Label,
} from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { consumptionSizes, getRelativeMoment } from '../../Utils';
import { COLOR_NUTRITION, TIME_FORMAT_STRING } from '../../constants';
import FoodImage from '../common-components/FoodImage';
import IConsumption from '../../models/IConsumption';

interface IConsumptionListProps {
  consumptionItems: IConsumption[];
}

const getDate = (consumptionItem: IConsumption): Moment => moment(consumptionItem.date).local();

const ConsumptionList: React.FC<IConsumptionListProps> = (
  { consumptionItems }: IConsumptionListProps,
) => {
  const consumptionItemsByDate = consumptionItems.length
    ? consumptionItems.reduce((acc: { [dateString: string]: IConsumption[] }, item) => {
      const dateString = getDate(item).format('YYYYMMDD');
      if (typeof acc[dateString] === 'undefined') {
        acc[dateString] = [];
      }
      acc[dateString].push(item);
      return acc;
    }, {}) : {};

  return (
    <div>
      {
            Object.keys(consumptionItemsByDate).sort().reverse().map((dateString) => (
              <div key={dateString}>
                <Divider horizontal>
                  <Header sub>{getRelativeMoment(dateString)}</Header>
                </Divider>

                <Divider hidden />
                <Card.Group>
                  {consumptionItemsByDate[dateString].map((item: IConsumption) => (
                    <Card key={item.id} as={Link} to={`/nutrition/history/${item.id}`} color={COLOR_NUTRITION}>
                      <Card.Content>
                        <FoodImage icon={item.food_icon} />
                        <Card.Header as="h3">{item.food_name}</Card.Header>
                        <Card.Meta>
                          <Label
                            size="small"
                          >
                            {consumptionSizes[item.quantity - 1]}
                          </Label>
                          &emsp;
                          {getDate(item).format(TIME_FORMAT_STRING)}
                        </Card.Meta>
                      </Card.Content>
                    </Card>
                  ))}
                </Card.Group>
                <Divider hidden />
              </div>
            ))
        }
    </div>
  );
};

export default ConsumptionList;
