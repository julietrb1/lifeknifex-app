import React from "react";
import {fireEvent, render, screen, waitFor} from "@testing-library/react";
import * as backend from '../../backend';
import {Provider} from "react-redux";
import configureStore, {MockStoreEnhanced} from 'redux-mock-store';
import {MemoryRouter as Router} from 'react-router-dom';
import thunk from 'redux-thunk'
import App from "../../App";
import {RootState} from "../../redux/rootReducer";

jest.mock('./../../backend');
const mockedBackend = backend as jest.Mocked<typeof backend>;
const mockStore = configureStore<RootState>([thunk]);
let store: MockStoreEnhanced<RootState>;
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

const emptyFoodsMessage = 'You don\'t have any foods yet.';

const renderNode = () => render(<Provider store={store}><Router initialEntries={['/nutrition/library']}><App/></Router></Provider>);

describe('<NutritionLibrary/>', () => {
    beforeEach(() => {
        store = mockStore(generateInitialStore());
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should show empty food list', async () => {
        renderNode();
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
        renderNode();
        await waitFor(() => screen.getByRole('heading', {name: foodName}));
    });

    it('should not perform any requests when loaded', async () => {
        store.getState().foodState.foodResponse = {};
        renderNode();
        await waitFor(() => screen.getByRole('heading', {name: emptyFoodsMessage}));
        expect(backend.reqGetAllFoods).not.toHaveBeenCalled();
    });

    it('should navigate to Log Consumption when Log clicked', async () => {
        const foodName = 'My food';
        store.getState().foodState.foodsByUrl[''] = {
            id: 1,
            url: '',
            name: foodName,
            health_index: 1,
            is_archived: false,
            icon: ''
        };

        renderNode();
        await waitFor(() => screen.getByRole('heading', {name: foodName}));
        fireEvent.click(screen.getByRole('button', {name: 'Log'}));
        await waitFor(() => screen.getByRole('heading', {name: 'Log Consumption'}));
    });
});