import React, { useEffect } from 'react';
import { Button, Divider, Icon } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import BSButton from 'react-bootstrap/Button';
import HeaderBar from '../common-components/HeaderBar';
import ConsumptionList from './ConsumptionList';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import NutritionHistoryEmpty from './NutritionHistoryEmpty';
import { COLOR_NUTRITION } from '../../constants';
import './NutritionList.scss';
import PlaceholderSet from '../common-components/PlaceholderSet';
import { fetchAllConsumptions } from '../../features/consumptions/consumptionSlice';
import {
  selectAllConsumptions,
  selectConsumptionsLoaded,
  selectConsumptionsLoading,
} from '../../features/consumptions/consumptionSelectors';
import {
  selectFoodCount,
  selectFoodsLoaded,
  selectFoodsLoading,
} from '../../features/foods/foodSelectors';
import { fetchAllFoods } from '../../features/foods/foodSlice';
import NutritionHistoryNoFood from './NutritionHistoryNoFood';

const sections = [
  { name: 'Nutrition' },
];

const NutritionList: React.FC = () => {
  const dispatch = useDispatch();
  const isLoaded = useSelector(selectConsumptionsLoaded);
  const consumptions = useSelector(selectAllConsumptions);
  const isLoading = useSelector(selectConsumptionsLoading);
  const areFoodsLoading = useSelector(selectFoodsLoading);
  const areFoodsLoaded = useSelector(selectFoodsLoaded);
  const totalFoodCount = useSelector(selectFoodCount);
  useEffect(() => {
    if (!isLoaded && !isLoading) dispatch(fetchAllConsumptions());
  }, [isLoaded, isLoading, dispatch]);

  useEffect(() => {
    if (!areFoodsLoaded && !areFoodsLoading) dispatch(fetchAllFoods());
  }, [dispatch, areFoodsLoaded, areFoodsLoading]);

  const pageContent = () => {
    if (isLoading || areFoodsLoading) {
      return (
        <div>
          <Divider hidden />
          <PlaceholderSet />
        </div>
      );
    }
    if (totalFoodCount && consumptions.length) {
      return <ConsumptionList consumptionItems={consumptions} />;
    }
    if (!totalFoodCount) {
      return <NutritionHistoryNoFood />;
    }
    return <NutritionHistoryEmpty />;
  };

  const newButton = () => {
    if (isLoading || consumptions.length) {
      return (
        <Button
          color={COLOR_NUTRITION}
          as={Link}
          to="/nutrition/log"
          animated="vertical"
        >
          <Button.Content visible>Log</Button.Content>
          <Button.Content hidden>
            <Icon name="plus" />
          </Button.Content>
        </Button>
      );
    }
    return null;
  };

  return (
    <div>
      <BreadcrumbSet sections={sections} />
      <HeaderBar title="Nutrition" />
      <div className="buttons">
        {newButton()}
        <BSButton variant="outline-primary" as={Link} to="/nutrition/log">Food Library</BSButton>
      </div>
      <Divider hidden />
      {pageContent()}
    </div>
  );
};

export default NutritionList;
