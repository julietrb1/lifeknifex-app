import {getTestStore, renderNode} from "../../testUtils";
import {screen, waitFor} from "@testing-library/react";
import {RootState} from "../../redux/rootReducer";
import {EnhancedStore} from "@reduxjs/toolkit";

const routeUrl = '/';
let store: EnhancedStore<RootState>;

describe('Home', () => {
    beforeEach(() => {
        store = getTestStore();
    });

    it('should show all six sections', async () => {
        renderNode(routeUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: 'Nutrition'}));
        await waitFor(() => screen.getByRole('heading', {name: 'Goals'}));
        await waitFor(() => screen.getByRole('heading', {name: 'Career'}));
        await waitFor(() => screen.getByRole('heading', {name: 'Mood'}));
        await waitFor(() => screen.getByRole('heading', {name: 'Score'}));
        await waitFor(() => screen.getByRole('heading', {name: 'Account'}));
    });
});