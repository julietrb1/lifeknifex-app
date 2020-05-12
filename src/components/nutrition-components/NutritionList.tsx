import React, {useEffect} from 'react';
import HeaderBar from '../common-components/HeaderBar';
import ConsumptionList from './ConsumptionList';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import {Button, Divider, Icon} from 'semantic-ui-react';
import NutritionHistoryEmpty from './NutritionHistoryEmpty';
import {Link} from 'react-router-dom';
import {COLOR_NUTRITION} from "../../constants";
import './NutritionList.scss';
import {useDispatch, useSelector} from "react-redux";
import PlaceholderSet from "../common-components/PlaceholderSet";
import {fetchAllConsumptions} from "../../features/consumptions/consumptionSlice";
import {
    selectAllConsumptions,
    selectConsumptionsLoaded,
    selectConsumptionsLoading
} from "../../features/consumptions/consumptionSelectors";

const sections = [
    {name: 'Nutrition'}
];

const NutritionList: React.FC = () => {
    const dispatch = useDispatch();
    const isLoaded = useSelector(selectConsumptionsLoaded);
    const consumptions = useSelector(selectAllConsumptions);
    const isLoading = useSelector(selectConsumptionsLoading);
    useEffect(() => {
        if (!isLoaded && !isLoading) {
            dispatch(fetchAllConsumptions());
        }
    }, [isLoaded, isLoading]);

    const pageContent = () => {
        if (!isLoading && consumptions.length) {
            return <ConsumptionList consumptionItems={consumptions}/>;
        } else if (isLoading) {
            return <div>
                <Divider hidden/>
                <PlaceholderSet/>
            </div>;
        } else {
            return <NutritionHistoryEmpty/>;
        }
    };

    const libraryButton = () => <Button
        basic
        as={Link}
        to='/nutrition/library'
        animated='vertical'>
        <Button.Content visible>Food Library</Button.Content>
        <Button.Content hidden>
            <Icon name='book'/>
        </Button.Content>
    </Button>;

    const newButton = () => {
        if (isLoading || consumptions.length) {
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

    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title="Nutrition" icon='nutrition'/>
        <div className='buttons'>
            {newButton()}
            {libraryButton()}
        </div>
        <Divider hidden/>
        {pageContent()}
    </div>;
};

export default NutritionList;