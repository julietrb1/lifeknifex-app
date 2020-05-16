import { render } from '@testing-library/react';
import { Provider } from 'react-redux';
import { MemoryRouter as Router } from 'react-router-dom';
import React from 'react';
import { AxiosResponse } from 'axios';
import { SnackbarProvider } from 'notistack';
import moment from 'moment';
import { configureStore, EnhancedStore } from '@reduxjs/toolkit';
import rootReducer, { RootState } from './redux/rootReducer';
import App from './App';
import IFood from './models/IFood';
import { IPaginatedResponse } from './models/IPaginatedReponse';
import { BACKEND_DATE_FORMAT } from './constants';
import IConsumption from './models/IConsumption';
import * as backend from './backend';
import IGoal from './models/IGoal';
import {
  createConsumptionSuccess,
  getAllConsumptionsSuccess,
} from './features/consumptions/consumptionSlice';
import { createFoodSuccess, getAllFoodsSuccess } from './features/foods/foodSlice';
import { createGoalSuccess, getAllGoalsSuccess } from './features/goals/goalSlice';
import { loginSuccess } from './features/auth/authSlice';
import IAnswer from './models/IAnswer';

export const testUsername = 'radicallyepichuman';
export const getTestStore = (isLoggedOut: boolean = false) => {
  const store = configureStore({
    reducer: rootReducer,
  });
  if (!isLoggedOut) {
    store.dispatch(loginSuccess({
      username: testUsername,
    }));
  }
  return store;
};

const generatePaginatedResponse = <T extends unknown>(results: any[]): IPaginatedResponse<T> => ({
  count: results.length,
  results,
});

export const generateAxiosResponse = <T extends unknown>(data: T): AxiosResponse<T> => ({
  data,
  status: 200,
  statusText: 'OK',
  config: {},
  headers: {},
});

export const generatePaginatedAxiosResponse = <T extends any>(
  data: T[]): AxiosResponse<IPaginatedResponse<T>> => generateAxiosResponse({
    count: data.length,
    results: data,
  });

export const generateFood = (foodName: string, isArchived = false): IFood => ({
  id: 1,
  url: `/foods/${foodName}`,
  name: foodName,
  health_index: 1,
  is_archived: isArchived,
  icon: '',
});

export const setFoodResponse = (store: EnhancedStore<RootState>, foods: IFood[] = []) => {
  store.dispatch(getAllFoodsSuccess(generatePaginatedResponse(foods)));
};

export const addFoodToStore = (
  store: EnhancedStore<RootState>, foodName: string, isArchived = false,
) => {
  const food = generateFood(foodName, isArchived);
  if (!store.getState().foodState.foodResponse) setFoodResponse(store, []);
  store.dispatch(createFoodSuccess(food));
  return food;
};

export const generateConsumption = (food: IFood) => {
  const consumption: IConsumption = {
    id: 1,
    url: '',
    food: food.url,
    food_icon: '',
    food_name: food.name,
    quantity: 1,
    date: moment().set('minute', 0).set('second', 0).format(BACKEND_DATE_FORMAT),
  };
  return consumption;
};

export const setConsumptionResponse = (
  store: EnhancedStore<RootState>, consumptions: IConsumption[] = [],
) => {
  store.dispatch(getAllConsumptionsSuccess(generatePaginatedResponse(consumptions)));
};

export const addConsumptionToStore = (store: EnhancedStore<RootState>, food: IFood) => {
  const consumption = generateConsumption(food);
  if (!store.getState().consumptionState.consumptionResponse) setConsumptionResponse(store, []);
  store.dispatch(createConsumptionSuccess(consumption));
  return consumption;
};

let lastId = 0;
const getRandomId = () => {
  lastId += 1;
  return lastId;
};

export const generateGoal = (
  goalQuestion: string, todaysAnswerValue: number | undefined = undefined, style: string = 'yesno',
): IGoal => {
  const id = getRandomId();
  return ({
    id,
    url: `goals/${id}`,
    question: goalQuestion,
    last_answered: todaysAnswerValue ? moment().format(BACKEND_DATE_FORMAT) : undefined,
    style,
    test: 'atleast',
    frequency: 1,
    todays_answer: '',
    todays_answer_value: todaysAnswerValue,
  });
};

export const setGoalResponse = (store: EnhancedStore<RootState>, goals: IGoal[] = []) => store.dispatch(getAllGoalsSuccess(generatePaginatedResponse(goals)));

export const addGoalToStore = (
  store: EnhancedStore<RootState>,
  goalQuestion: string,
  todaysAnswerValue: number | undefined = undefined,
) => {
  const goal = generateGoal(goalQuestion, todaysAnswerValue);
  if (!store.getState().goalState.goalResponse) setGoalResponse(store, []);
  store.dispatch(createGoalSuccess(goal));
  return goal;
};

export const renderNode = (routeUrl: string, store: EnhancedStore<RootState>) => render(
  <SnackbarProvider maxSnack={1}>
    <Provider store={store}>
      <Router
        initialEntries={[routeUrl]}
      >
        <App />
      </Router>
    </Provider>
  </SnackbarProvider>,
);

export const setUpMockBackend = (mockBackend: jest.Mocked<typeof backend>) => {
  mockBackend.reqGetAllFoods.mockResolvedValue(
    generatePaginatedAxiosResponse<IFood>([]),
  );

  mockBackend.reqGetFood.mockResolvedValue(
    generateAxiosResponse<IFood>({} as IFood),
  );

  mockBackend.reqGetAllConsumptions.mockResolvedValue(
    generatePaginatedAxiosResponse<IConsumption>([]),
  );

  mockBackend.reqGetConsumption.mockResolvedValue(
    generateAxiosResponse<IConsumption>({} as IConsumption),
  );

  mockBackend.reqGetAllGoals.mockResolvedValue(
    generatePaginatedAxiosResponse<IGoal>([]),
  );

  mockBackend.reqGetGoal.mockResolvedValue(
    generateAxiosResponse<IGoal>({} as IGoal),
  );

  const answerFn = (
    g: IGoal, a: number,
  ) => Promise.resolve(generateAxiosResponse<IAnswer>({
    id: g.id,
    goal: g.url,
    date: moment().format(BACKEND_DATE_FORMAT),
    value: a,
    url: a.toString(),
  }));

  mockBackend.reqUpdateAnswer.mockImplementation(answerFn);
  mockBackend.reqCreateAnswer.mockImplementation(answerFn);
};
