import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import * as backend from '../../backend';
import NutritionLibrary from "./NutritionLibrary";
import {Provider} from "react-redux";
import configureStore from 'redux-mock-store';
import {BrowserRouter as Router} from 'react-router-dom';
import thunk from 'redux-thunk'

jest.mock('./../../backend');
const mockedBackend = backend as jest.Mocked<typeof backend>;
const mockStore = configureStore([thunk]);

const emptyFoodsMessage = 'You don\'t have any foods yet.';
describe('<NutritionLibrary/>', () => {
    afterEach(() => {
        jest.clearAllMocks();
    });
    it('should show empty message with no foods', async () => {
        mockedBackend.reqGetAllFoods.mockImplementationOnce(async () => ({
            data: {results: []},
            config: {},
            headers: [],
            request: {},
            status: 200,
            statusText: ''
        }))
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

    it('should not perform any requests when loaded', async () => {
        mockedBackend.reqGetAllFoods.mockImplementationOnce(async () => ({
            data: {results: []},
            config: {},
            headers: [],
            request: {},
            status: 200,
            statusText: ''
        }))
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