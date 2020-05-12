import React from "react";
import {screen, waitFor} from "@testing-library/react";
import * as backend from '../../backend';
import {MockStoreEnhanced} from 'redux-mock-store';
import {RootState} from "../../redux/rootReducer";
import {generateAxiosRequest, generateFood, generateMockStore, renderNode} from "../../testUtils";
import userEvent from "@testing-library/user-event";
import IFood from "../../models/IFood";

const mockBackend = backend as jest.Mocked<typeof backend>;

jest.mock('./../../backend');

const newRouteUrl = '/nutrition/library/new';
const newFoodHeading = 'New Food';
const foodLibraryHeading = 'Food Library';
let store: MockStoreEnhanced<RootState>;

describe('<FoodForm/>', () => {
    beforeEach(() => {
        store = generateMockStore();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should save a new food and go to library', async () => {
        const food = generateFood('My food');
        mockBackend.reqCreateFood.mockResolvedValue(generateAxiosRequest<IFood>(food));
        renderNode(newRouteUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
        await userEvent.type(screen.getByLabelText('Name'), food.name);
        await userEvent.click(screen.getByLabelText('Healthy'));
        await userEvent.click(screen.getByRole('button', {name: 'Save Food'}));
        await waitFor(() => screen.getByRole('heading', {name: foodLibraryHeading}));
        expect(backend.reqCreateFood).toHaveBeenCalledWith({name: food.name, health_index: 1});
    });
});