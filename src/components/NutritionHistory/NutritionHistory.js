import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar';
import ConsumptionList from './ConsumptionList/ConsumptionList';
import BreadcrumbSet from '../common/BreadcrumbSet/BreadcrumbSet';
import {getConsumptions} from '../../Backend';
import RequestComponent from '../common/RequestComponent/RequestComponent';
import {Button, Divider, Placeholder, Icon} from 'semantic-ui-react';
import NutritionHistoryEmpty from './NutritionHistoryEmpty/NutritionHistoryEmpty';
import {Link} from 'react-router-dom';

const sections = [
    {name: 'Nutrition', href: '/nutrition'},
    {name: 'Consumption History'}
];

class NutritionHistory extends RequestComponent {
    constructor(props) {
        super(props);
        this.state = {
            consumptionItems: [],
            loading: true
        };
    }

    componentDidMount() {
        getConsumptions(this.cancelToken)
            .then(consumptionItems => {
                this.setState({
                    consumptionItems,
                    loading: false
                });
            });
    }

    render() {
        return <div>
            <BreadcrumbSet sections={sections}/>
            <HeaderBar title="Consumption History" icon='nutrition'/>
            <this.NewButton/>
            <Divider hidden/>
            <this.PageContent/>
        </div>;
    }

    NewButton = () => {
        if (this.state.loading || this.state.consumptionItems.length) {
            return <Button
                floated='right'
                primary
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

export default NutritionHistory;