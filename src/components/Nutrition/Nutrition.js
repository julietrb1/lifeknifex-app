import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar';
import ConsumptionList from './ConsumptionList/ConsumptionList';
import BreadcrumbSet from '../common/BreadcrumbSet/BreadcrumbSet';
import {getConsumptions} from '../../Backend';
import RequestComponent from '../common/RequestComponent/RequestComponent';
import {Button, Divider, Icon, Placeholder} from 'semantic-ui-react';
import NutritionHistoryEmpty from './NutritionHistoryEmpty/NutritionHistoryEmpty';
import {Link} from 'react-router-dom';
import {COLOR_NUTRITION} from "../../constants";
import './Nutrition.scss';
import axios from 'axios';

const sections = [
    {name: 'Nutrition'}
];

function assignFoods(consumptionItems) {
    return Promise.all(consumptionItems.results.map(item => new Promise(resolve => {
        axios.get(item.food)
            .then(res => res.data)
            .then(food => ({
                ...item,
                food
            }))
            .then(resolve);
    })));
}

class Nutrition extends RequestComponent {
    constructor(props) {
        super(props);
        this.state = {
            consumptionItems: [],
            loading: true
        };
    }

    componentDidMount() {
        getConsumptions(this.cancelToken)
            .then(assignFoods)
            .then(consumptionItems => {
                this.setState({
                    consumptionItems: consumptionItems,
                    loading: false
                });
            });
    }

    render() {
        return <div>
            <BreadcrumbSet sections={sections}/>
            <HeaderBar title="Nutrition" icon='nutrition'/>
            <div className='buttons'>
                <this.NewButton/>
                <this.LibraryButton/>
            </div>
            <Divider hidden/>
            <this.PageContent/>
        </div>;
    }

    LibraryButton = () => <Button
        basic
        as={Link}
        to='/nutrition/library'
        animated='vertical'>
        <Button.Content visible>Food Library</Button.Content>
        <Button.Content hidden>
            <Icon name='book'/>
        </Button.Content>
    </Button>;

    NewButton = () => {
        if (this.state.loading || this.state.consumptionItems.length) {
            return <Button
                color={COLOR_NUTRITION}
                as={Link}
                to='/nutrition/log'
                animated='vertical'>
                <Button.Content visible>Log</Button.Content>
                <Button.Content hidden>
                    <Icon name='plus'/>
                </Button.Content>
            </Button>;
        } else {
            return null;
        }
    };

    PageContent = () => {
        if (!this.state.loading && this.state.consumptionItems.length) {
            return <ConsumptionList consumptionItems={this.state.consumptionItems}/>;
        } else if (this.state.loading) {
            return <div>
                <Divider hidden/>
                <Placeholder>
                    <Placeholder.Header>
                        <Placeholder.Line/>
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                        <Placeholder.Line/>
                    </Placeholder.Paragraph>
                    <Placeholder.Header>
                        <Placeholder.Line/>
                    </Placeholder.Header>
                    <Placeholder.Paragraph>
                        <Placeholder.Line/>
                    </Placeholder.Paragraph>
                </Placeholder>
            </div>;
        } else {
            return <NutritionHistoryEmpty/>;
        }
    };
}

export default Nutrition;