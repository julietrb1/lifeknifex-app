import {generateMockStore, renderNode} from "../../testUtils";
import {screen, waitFor} from "@testing-library/react";
import {MockStoreEnhanced} from "redux-mock-store";
import {RootState} from "../../redux/rootReducer";

const routeUrl = '/';
let store: MockStoreEnhanced<RootState>;

describe('Home', () => {
    beforeEach(() => {
        store = generateMockStore();
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