import React from "react";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import * as backend from '../../backend';
import {MockStoreEnhanced} from 'redux-mock-store';
import {RootState} from "../../redux/rootReducer";
import {generateMockStore, renderNode} from "../../testUtils";

jest.mock('./../../backend');

const routeUrl = '/nutrition/library';
let store: MockStoreEnhanced<RootState>;
const emptyFoodsMessage = 'You don\'t have any foods yet.';

function addFoodToStore(foodName: string) {
    store.getState().foodState.foodsByUrl[''] = {
        id: 1,
        url: '',
        name: foodName,
        health_index: 1,
        is_archived: false,
        icon: ''
    };
}

describe('<NutritionLibrary/>', () => {
    beforeEach(() => {
        store = generateMockStore();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should show empty food list', async () => {
        renderNode(routeUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: emptyFoodsMessage}));
        expect(backend.reqGetAllFoods).toHaveBeenCalledTimes(1);
    });

    it('should show foods', async () => {
        const foodName = 'My food';
        store.getState().foodState.foodsByUrl[''] = {
            id: 1,
            url: '',
            name: foodName,
            health_index: 1,
            is_archived: false,
            icon: ''
        };
        renderNode(routeUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: foodName}));
    });

    it('should not perform any requests when loaded', async () => {
        store.getState().foodState.foodResponse = {};
        renderNode(routeUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: emptyFoodsMessage}));
        expect(backend.reqGetAllFoods).not.toHaveBeenCalled();
    });

    it('should navigate to Log Consumption when Log clicked', async () => {
        const foodName = 'My food';
        addFoodToStore(foodName);
        renderNode(routeUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: foodName}));
        fireEvent.click(screen.getByRole('button', {name: 'Log'}));
        await waitFor(() => screen.getByRole('heading', {name: 'Log Consumption'}));
    });

    it('should navigate to new food form with no foods', async () => {
        renderNode(routeUrl, store);
        fireEvent.click(screen.getByRole('button', {name: 'Let\'s Create One'}));
        await waitFor(() => screen.getByRole('heading', {name: 'New Food'}));
    });

    it('should navigate to new food form with foods', async () => {
        addFoodToStore('My food');
        renderNode(routeUrl, store);
        fireEvent.click(screen.getByRole('button', {name: 'New Food'}));
        await waitFor(() => screen.getByRole('heading', {name: 'New Food'}));
    });
});