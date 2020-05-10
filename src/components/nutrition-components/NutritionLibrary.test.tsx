import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import * as backend from '../../backend';
import NutritionLibrary from "./NutritionLibrary";
import {Provider} from "react-redux";
import configureStore from 'redux-mock-store';
import {MemoryRouter as Router} from 'react-router-dom';
import thunk from 'redux-thunk'
import IFood from "../../models/IFood";

jest.mock('./../../backend');
const mockedBackend = backend as jest.Mocked<typeof backend>;
const mockStore = configureStore([thunk]);

const emptyFoodsMessage = 'You don\'t have any foods yet.';
describe('<NutritionLibrary/>', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should show empty food list', async () => {
        const store = mockStore({
            foodState: {
                isLoading: false,
                foodsByUrl: []
            }
        });

        render(<Router><Provider store={store}><NutritionLibrary/></Provider></Router>);
        await waitFor(() => screen.getByRole('heading', {name: emptyFoodsMessage}));
        expect(backend.reqGetAllFoods).toHaveBeenCalledTimes(1);
    });

    it('should show foods', async () => {
        const foodName = 'My food';
        const food: IFood = {id: 1, url: '', name: foodName, health_index: 1, is_archived: false, icon: ''};
        const store = mockStore({
            foodState: {
                isLoading: false,
                foodsByUrl: [food],
                foodResponse: {}
            }
        });

        render(<Router><Provider store={store}><NutritionLibrary/></Provider></Router>);
        await waitFor(() => screen.getByRole('heading', {name: foodName}));
    });

    it('should not perform any requests when loaded', async () => {
        const store = mockStore({
            foodState: {
                isLoading: false,
                foodsByUrl: [],
                foodResponse: {}
            }
        });

        render(<Router><Provider store={store}><NutritionLibrary/></Provider></Router>);
        await waitFor(() => screen.getByRole('heading', {name: emptyFoodsMessage}));
        expect(backend.reqGetAllFoods).not.toHaveBeenCalled();
    });
});