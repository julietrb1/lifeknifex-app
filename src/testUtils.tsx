import configureStore, {MockStoreEnhanced} from "redux-mock-store";
import {RootState} from "./redux/rootReducer";
import thunk from "redux-thunk";
import {render} from "@testing-library/react";
import {Provider} from "react-redux";
import {MemoryRouter as Router} from "react-router";
import App from "./App";
import React from "react";

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

export const generateMockStore = () => mockStore(generateInitialStore());

export const renderNode = (routeUrl: string, store: MockStoreEnhanced<RootState>) => render(<Provider
    store={store}><Router initialEntries={[routeUrl]}><App/></Router></Provider>);