import React from "react";
import {screen, waitFor} from "@testing-library/react";
import * as backend from '../../backend';
import {MockStoreEnhanced} from 'redux-mock-store';
import {RootState} from "../../redux/rootReducer";
import {
    addFoodToStore,
    generateAxiosResponse,
    generateFood,
    generateMockStore,
    generatePaginatedAxiosResponse,
    renderNode
} from "../../testUtils";
import userEvent from "@testing-library/user-event";
import IFood from "../../models/IFood";

jest.mock('./../../backend');
const mockBackend = backend as jest.Mocked<typeof backend>;
const newRouteUrl = '/nutrition/library/new';
const newFoodHeading = 'New Food';
const editFoodHeading = 'Edit Food';
const foodLibraryHeading = 'Food Library';
let store: MockStoreEnhanced<RootState>;

describe('<FoodForm/>', () => {
    beforeEach(() => {
        store = generateMockStore();
        mockBackend.reqGetAllFoods.mockResolvedValue(generatePaginatedAxiosResponse<IFood>([]));
        mockBackend.reqGetFood.mockResolvedValue(generateAxiosResponse<IFood>({} as IFood));
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should edit food and go to library', async () => {
        const food = addFoodToStore(store, 'My food');
        mockBackend.reqGetFood.mockResolvedValueOnce(generateAxiosResponse<IFood>(food));
        const newFood = {...food, name: 'My food 2'};
        mockBackend.reqUpdateFood.mockResolvedValue(generateAxiosResponse<IFood>(newFood));
        renderNode(`/nutrition/library/manage/${food.id}`, store);
        await waitFor(() => (screen.getByDisplayValue(food.name) as HTMLInputElement).value);
        expect((screen.getByLabelText('Healthy') as HTMLInputElement).value).toEqual(String(food.health_index));
        await waitFor(() => screen.getByRole('heading', {name: editFoodHeading}));
        await userEvent.clear(screen.getByLabelText('Name'));
        await userEvent.type(screen.getByLabelText('Name'), newFood.name);
        await userEvent.click(screen.getByRole('button', {name: 'Save Food'}));
        await waitFor(() => screen.getByRole('heading', {name: foodLibraryHeading}));
        expect(backend.reqUpdateFood).toHaveBeenCalledWith(newFood);
        await waitFor(() => screen.getByText(`Food "${newFood.name}" saved`));
    });

    it('should save a new food and go to library', async () => {
        const food = generateFood('My food');
        mockBackend.reqCreateFood.mockResolvedValue(generateAxiosResponse<IFood>(food));
        renderNode(newRouteUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
        await userEvent.type(screen.getByLabelText('Name'), food.name);
        await userEvent.click(screen.getByLabelText('Healthy'));
        await userEvent.click(screen.getByRole('button', {name: 'Save Food'}));
        await waitFor(() => screen.getByRole('heading', {name: foodLibraryHeading}));
        expect(backend.reqCreateFood).toHaveBeenCalledWith({name: food.name, health_index: 1, icon: ''});
        await waitFor(() => screen.getByText(`Food "${food.name}" saved`));
    });

    it('should show a success snackbar after saving', async () => {
        const food = generateFood('My food');
        mockBackend.reqCreateFood.mockResolvedValue(generateAxiosResponse<IFood>(food));
        renderNode(newRouteUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
        await userEvent.type(screen.getByLabelText('Name'), food.name);
        await userEvent.click(screen.getByLabelText('Healthy'));
        await userEvent.click(screen.getByRole('button', {name: 'Save Food'}));
        await waitFor(() => screen.getByText(`Food "${food.name}" saved`));
    });

    it('should show error with missing name', async () => {
        renderNode(newRouteUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
        await userEvent.click(screen.getByLabelText('Healthy'));
        await userEvent.click(screen.getByRole('button', {name: 'Save Food'}));
        expect(backend.reqCreateFood).not.toHaveBeenCalled();
        await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
        await waitFor(() => screen.getByText(`Food requires a name`));
    });

    it('should show error with missing quality', async () => {
        renderNode(newRouteUrl, store);
        await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
        await userEvent.type(screen.getByLabelText('Name'), 'My food');
        await userEvent.click(screen.getByRole('button', {name: 'Save Food'}));
        expect(backend.reqCreateFood).not.toHaveBeenCalled();
        await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
        await waitFor(() => screen.getByText(`Food requires a quality`));
    });
});