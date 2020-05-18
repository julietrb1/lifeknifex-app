import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import HeaderBar from '../common-components/HeaderBar';
import ConsumptionList from './ConsumptionList';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import NutritionHistoryEmpty from './NutritionHistoryEmpty';
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
        <Button as={Link} to="/nutrition/log" variant="primary">Log</Button>
      );
    }
    return null;
  };

  return (
    <div>
      <BreadcrumbSet sections={sections} />
      <HeaderBar title="Nutrition" />
      <div className="text-center mb-4">
        <ButtonGroup>
          {newButton()}
          <Button variant="outline-primary" as={Link} to="/nutrition/library">Food Library</Button>
        </ButtonGroup>
      </div>
      {pageContent()}
    </div>
  );
};

export default NutritionList;
