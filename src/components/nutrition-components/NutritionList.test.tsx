import React from "react";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import * as backend from '../../backend';
import {MockStoreEnhanced} from 'redux-mock-store';
import {RootState} from "../../redux/rootReducer";
import {addConsumptionToStore, addFoodToStore, generateMockStore, renderNode} from "../../testUtils";

jest.mock('./../../backend');

const routeUrl = '/nutrition';
let store: MockStoreEnhanced<RootState>;
const emptyConsumptionMessage = 'You haven\'t logged any consumption yet.';
const emptyFoodMessage = 'You need some food to log.';

describe('<NutritionList/>', () => {
    beforeEach(() => {
        store = generateMockStore();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should show empty consumption list', async () => {
        renderNode(routeUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: emptyConsumptionMessage}));
        expect(backend.reqGetAllConsumptions).toHaveBeenCalledTimes(1);
    });

    it('should show consumptions', async () => {
        const foodName = 'My food';
        const food = addFoodToStore(store, foodName);
        addConsumptionToStore(store, food);
        renderNode(routeUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: foodName}));
    });

    it('should not perform any requests when loaded', async () => {
        store.getState().consumptionState.consumptionResponse = {};
        renderNode(routeUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: emptyConsumptionMessage}));
        expect(backend.reqGetAllFoods).not.toHaveBeenCalled();
    });

    it('should navigate when Log clicked with food and without consumptions', async () => {
        const food = addFoodToStore(store, 'My food');
        addConsumptionToStore(store, food);
        renderNode(routeUrl, store);
        fireEvent.click(screen.getByRole('button', {name: 'Get Logging'}));
        await waitFor(() => screen.getByRole('heading', {name: 'Log Consumption'}));
    });

    it('should navigate to new food form with no foods', async () => {
        renderNode(routeUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: emptyFoodMessage}));
        fireEvent.click(screen.getByRole('button', {name: 'New Food'}));
        await waitFor(() => screen.getByRole('heading', {name: 'New Food'}));
    });
});