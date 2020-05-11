import React from "react";
import {fireEvent, screen, waitFor} from "@testing-library/react";
import * as backend from '../../backend';
import {MockStoreEnhanced} from 'redux-mock-store';
import {RootState} from "../../redux/rootReducer";
import {generateMockStore, renderNode} from "../../testUtils";

jest.mock('./../../backend');

const routeUrl = '/goals';
let store: MockStoreEnhanced<RootState>;
const emptyGoalsMessage = 'You don\'t have any goals yet.';

describe('<Goals/>', () => {
    beforeEach(() => {
        store = generateMockStore();
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should show empty goal list', async () => {
        renderNode(routeUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: emptyGoalsMessage}));
        expect(backend.reqGetAllGoals).toHaveBeenCalledTimes(1);
    });

    it('should show goals', async () => {
        const goalName = 'My goal';
        store.getState().goalState.goalsByUrl[''] = {
            id: 1,
            url: '',
            question: goalName,
            test: 'yesno'
        };
        renderNode(routeUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: goalName}));
    });

    it('should not perform any requests when loaded', async () => {
        store.getState().goalState.goalResponse = {};
        renderNode(routeUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: emptyGoalsMessage}));
        expect(backend.reqGetAllGoals).not.toHaveBeenCalled();
    });

    it('should navigate to GoalForm when New Goal clicked', async () => {
        renderNode(routeUrl, store);
        fireEvent.click(screen.getByRole('button', {name: 'New Goal'}));
        await waitFor(() => screen.getByRole('heading', {name: 'New Goal'}));
    });
});