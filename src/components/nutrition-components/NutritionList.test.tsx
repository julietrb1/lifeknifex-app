import React from "react";
import {screen, waitFor} from "@testing-library/react";
import * as backend from '../../backend';
import {MockStoreEnhanced} from 'redux-mock-store';
import {RootState} from "../../redux/rootReducer";
import {addConsumptionToStore, addFoodToStore, generateMockStore, renderNode} from "../../testUtils";

jest.mock('./../../backend');

const routeUrl = '/nutrition';
let store: MockStoreEnhanced<RootState>;
const emptyConsumptionMessage = 'You haven\'t logged any consumption yet.';

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
});