import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar';
import ConsumptionList from './ConsumptionList/ConsumptionList';
import BreadcrumbSet from '../common/BreadcrumbSet/BreadcrumbSet';
import RequestComponent from '../common/RequestComponent/RequestComponent';
import {Button, Divider, Icon} from 'semantic-ui-react';
import NutritionHistoryEmpty from './NutritionHistoryEmpty/NutritionHistoryEmpty';
import {Link} from 'react-router-dom';
import {COLOR_NUTRITION} from "../../constants";
import './Nutrition.scss';
import {connect} from "react-redux";
import {consumptionsFetchAll} from "../../actions/consumptions";
import PlaceholderSet from "../common/PlaceholderSet/PlaceholderSet";

const sections = [
    {name: 'Nutrition'}
];

class Nutrition extends RequestComponent {
    componentDidMount() {
        if (!this.props.consumptions.results) {
            this.props.fetchConsumptions();
        }
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
        if (this.props.isLoading || this.props.consumptions.results) {
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
        if (!this.props.isLoading && this.props.consumptions.results) {
            return <ConsumptionList consumptionItems={this.props.consumptions.results}/>;
        } else if (this.props.isLoading) {
            return <div>
                <Divider hidden/>
                <PlaceholderSet/>
            </div>;
        } else {
            return <NutritionHistoryEmpty/>;
        }
    };
}

const mapStateToProps = state => ({
    isLoading: state.consumptionsIsLoading,
    consumptions: state.consumptions,
});

const mapDispatchToProps = dispatch => ({
    fetchConsumptions: () => dispatch(consumptionsFetchAll()),
});

export default connect(mapStateToProps, mapDispatchToProps)(Nutrition);