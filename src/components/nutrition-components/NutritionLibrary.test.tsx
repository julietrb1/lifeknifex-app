import React from "react";
import {render, screen, waitFor} from "@testing-library/react";
import * as backend from '../../backend';
import NutritionLibrary from "./NutritionLibrary";
import {Provider} from "react-redux";
import configureStore from 'redux-mock-store';
import {BrowserRouter as Router} from 'react-router-dom';
import thunk from 'redux-thunk'

jest.mock('./../../backend');

const mockStore = configureStore([thunk]);

describe('<NutritionLibrary/>', () => {
    it('should fetch foods when not yet loaded', async () => {
        const store = mockStore({
            foodState: {
                isLoading: false,
                foodsByUrl: []
            }
        });
        render(<Router><Provider store={store}><NutritionLibrary/></Provider></Router>);
        await waitFor(() => screen.getByRole('heading', {name: 'You don\'t have any foods yet.'}));
        expect(backend.reqGetAllFoods).toHaveBeenCalledTimes(1);
    });
});