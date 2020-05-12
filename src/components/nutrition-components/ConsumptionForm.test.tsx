import React from "react";
import {screen, waitFor} from "@testing-library/react";
import * as backend from '../../backend';
import {MockStoreEnhanced} from 'redux-mock-store';
import {RootState} from "../../redux/rootReducer";
import {
    addConsumptionToStore,
    addFoodToStore,
    generateAxiosResponse,
    generateMockStore,
    renderNode,
    setUpMockBackend
} from "../../testUtils";
import userEvent from "@testing-library/user-event";
import IFood from "../../models/IFood";
import IConsumption from "../../models/IConsumption";
import moment from "moment";
import {TIME_FORMAT_STRING} from "../../constants";

jest.mock('./../../backend');
const mockBackend = backend as jest.Mocked<typeof backend>;
const logConsumptionUrl = '/nutrition/history/log';
const editConsumptionUrlBase = '/nutrition/history/'
const logConsumptionHeading = 'Log Consumption';
const editConsumptionHeading = 'Edit Consumption';
const nutritionHeading = 'Nutrition';
let store: MockStoreEnhanced<RootState>;

describe('<ConsumptionForm/>', () => {
    beforeEach(() => {
        store = generateMockStore();
        setUpMockBackend(mockBackend);
    });

    afterEach(() => {
        jest.clearAllMocks();
    });

    it('should edit consumption and go to nutrition', async () => {
        const food = addFoodToStore(store, 'My food');
        mockBackend.reqGetFood.mockResolvedValueOnce(generateAxiosResponse<IFood>(food));
        const consumption = addConsumptionToStore(store, food);
        const newConsumption: IConsumption = {...consumption, quantity: 3};
        mockBackend.reqUpdateConsumption.mockResolvedValue(generateAxiosResponse<IConsumption>(newConsumption));

        renderNode(`${editConsumptionUrlBase}${consumption.id}`, store);
        await waitFor(() => screen.getByRole('heading', {name: editConsumptionHeading}));
        const foodEl = screen.getByLabelText('Food') as HTMLInputElement;
        expect(foodEl.value).toEqual(food.name);
        expect(foodEl.disabled).toBeTruthy();
        const whenEl = screen.getByLabelText('When') as HTMLInputElement;
        expect(whenEl.value).toEqual(moment(consumption.date).format(TIME_FORMAT_STRING));
        expect(whenEl.disabled).toBeTruthy();
        expect((screen.getByLabelText('Small') as HTMLInputElement).checked).toBeTruthy();
        await userEvent.click(screen.getByRole('radio', {name: 'Large'}));
        await userEvent.click(screen.getByRole('button', {name: 'Save Log'}))
        await waitFor(() => screen.getByRole('heading', {name: nutritionHeading}));
        await waitFor(() => screen.getByText(`Consumption of "${newConsumption.food_name}" saved`));
        expect(backend.reqUpdateConsumption).toHaveBeenCalledWith(newConsumption);
    });

    // it('should save a new food and go to library', async () => {
    //     const food = generateFood('My food');
    //     mockBackend.reqCreateFood.mockResolvedValue(generateAxiosResponse<IFood>(food));
    //     renderNode(logConsumptionUrl, store);
    //     await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
    //     await userEvent.type(screen.getByLabelText('Name'), food.name);
    //     await userEvent.click(screen.getByLabelText('Healthy'));
    //     await userEvent.click(screen.getByRole('button', {name: 'Save Food'}));
    //     await waitFor(() => screen.getByRole('heading', {name: foodLibraryHeading}));
    //     expect(backend.reqCreateFood).toHaveBeenCalledWith({name: food.name, health_index: 1, icon: ''});
    //     await waitFor(() => screen.getByText(`Food "${food.name}" saved`));
    // });
    //
    // it('should show a success snackbar after saving', async () => {
    //     const food = generateFood('My food');
    //     mockBackend.reqCreateFood.mockResolvedValue(generateAxiosResponse<IFood>(food));
    //     renderNode(logConsumptionUrl, store);
    //     await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
    //     await userEvent.type(screen.getByLabelText('Name'), food.name);
    //     await userEvent.click(screen.getByLabelText('Healthy'));
    //     await userEvent.click(screen.getByRole('button', {name: 'Save Food'}));
    //     await waitFor(() => screen.getByText(`Food "${food.name}" saved`));
    // });
    //
    // it('should show error with missing name', async () => {
    //     renderNode(logConsumptionUrl, store);
    //     await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
    //     await userEvent.click(screen.getByLabelText('Healthy'));
    //     await userEvent.click(screen.getByRole('button', {name: 'Save Food'}));
    //     expect(backend.reqCreateFood).not.toHaveBeenCalled();
    //     await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
    //     await waitFor(() => screen.getByText(`Food requires a name`));
    // });
    //
    // it('should show error with missing quality', async () => {
    //     renderNode(logConsumptionUrl, store);
    //     await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
    //     await userEvent.type(screen.getByLabelText('Name'), 'My food');
    //     await userEvent.click(screen.getByRole('button', {name: 'Save Food'}));
    //     expect(backend.reqCreateFood).not.toHaveBeenCalled();
    //     await waitFor(() => screen.getByRole('heading', {name: newFoodHeading}));
    //     await waitFor(() => screen.getByText(`Food requires a quality`));
    // });
});