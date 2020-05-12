import configureStore, {MockStoreEnhanced} from "redux-mock-store";
import {RootState} from "./redux/rootReducer";
import thunk from "redux-thunk";
import {render} from "@testing-library/react";
import {Provider} from "react-redux";
import {MemoryRouter as Router} from "react-router";
import App from "./App";
import React from "react";
import IFood from "./models/IFood";

const mockStore = configureStore<RootState>([thunk]);
const generateInitialStore = (): RootState => ({
    foodState: {
        isLoading: false,
        foodsByUrl: {},
        foodResponse: null,
        error: null
    }, consumptionState: {
        consumptionsById: {},
        consumptionResponse: null,
        isLoading: false,
        error: null
    }, goalState: {
        error: null,
        isLoading: false,
        goalResponse: null,
        goalsByUrl: {}
    }
});

const generateResponse = (results: any[]) => ({
    count: results.length,
    results
});

export const addFoodToStore = (store: MockStoreEnhanced<RootState>, foodName: string, isArchived = false) => {
    const food = {
        id: 1,
        url: `/foods/${foodName}`,
        name: foodName,
        health_index: 1,
        is_archived: isArchived,
        icon: ''
    };

    store.getState().foodState.foodsByUrl[1] = food;
    store.getState().foodState.foodResponse = generateResponse([food]);
    return food;
};

export const addConsumptionToStore = (store: MockStoreEnhanced<RootState>, food: IFood, isArchived = false) => {
    const consumption = {
        id: 1,
        url: '',
        food: food.url,
        food_icon: '',
        food_name: food.name,
        quantity: 1,
        date: '2020-05-12T00:00:00Z'
    };
    store.getState().consumptionState.consumptionsById[''] = consumption;
    store.getState().consumptionState.consumptionResponse = generateResponse([consumption]);
    return consumption;
};

export const generateMockStore = () => mockStore(generateInitialStore());

export const renderNode = (routeUrl: string, store: MockStoreEnhanced<RootState>) => render(<Provider
    store={store}><Router initialEntries={[routeUrl]}><App/></Router></Provider>);