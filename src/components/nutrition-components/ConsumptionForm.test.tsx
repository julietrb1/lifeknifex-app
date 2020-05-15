import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import { EnhancedStore } from '@reduxjs/toolkit';
import * as backend from '../../backend';
import { RootState } from '../../redux/rootReducer';
import {
  addConsumptionToStore,
  addFoodToStore,
  generateAxiosResponse,
  getTestStore,
  renderNode,
  setUpMockBackend,
} from '../../testUtils';
import IFood from '../../models/IFood';
import IConsumption from '../../models/IConsumption';
import { TIME_FORMAT_STRING } from '../../constants';

jest.mock('./../../backend');
const mockBackend = backend as jest.Mocked<typeof backend>;
const editConsumptionUrlBase = '/nutrition/history/';
const editConsumptionHeading = 'Edit Consumption';
const nutritionHeading = 'Nutrition';

let store: EnhancedStore<RootState>;

describe('ConsumptionForm', () => {
  beforeEach(() => {
    store = getTestStore();
    setUpMockBackend(mockBackend);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should edit consumption and go to nutrition', async () => {
    const food = addFoodToStore(store, 'My food');
    mockBackend.reqGetFood.mockResolvedValueOnce(generateAxiosResponse<IFood>(food));
    const consumption = addConsumptionToStore(store, food);
    const newConsumption: IConsumption = { ...consumption, quantity: 3 };
    mockBackend.reqUpdateConsumption.mockResolvedValue(
      generateAxiosResponse<IConsumption>(newConsumption),
    );

    renderNode(`${editConsumptionUrlBase}${consumption.id}`, store);
    await waitFor(() => screen.getByRole('heading', { name: editConsumptionHeading }));
    const foodEl = screen.getByLabelText('Food') as HTMLInputElement;
    expect(foodEl.value).toEqual(food.name);
    expect(foodEl.disabled).toBeTruthy();
    const whenEl = screen.getByLabelText('When') as HTMLInputElement;
    expect(whenEl.value).toEqual(moment(consumption.date).format(TIME_FORMAT_STRING));
    expect(whenEl.disabled).toBeTruthy();
    expect((screen.getByLabelText('Small') as HTMLInputElement).checked).toBeTruthy();
    await userEvent.click(screen.getByRole('radio', { name: 'Large' }));
    await userEvent.click(screen.getByRole('button', { name: 'Save Log' }));
    await waitFor(() => screen.getByRole('heading', { name: nutritionHeading }));
    await waitFor(() => screen.getByText(`Consumption of "${newConsumption.food_name}" saved`));
    expect(backend.reqUpdateConsumption).toHaveBeenCalledWith(newConsumption);
  });

  // TODO: Fix test - hangs on waiting for getByText(food.name)
  // it('should save new nutrition', async () => {
  //     const food = addFoodToStore(store, 'My food');
  //     mockBackend.reqGetAllFoods.mockResolvedValue(
  //       generatePaginatedAxiosResponse<IFood>([food]),
  //     );
  //     mockBackend.reqGetFood.mockResolvedValue(generateAxiosResponse<IFood>(food));
  //     const consumption = generateConsumption(food);
  //     mockBackend.reqCreateConsumption.mockResolvedValue(
  //       generateAxiosResponse<IConsumption>(consumption),
  //     );
  //
  //     renderNode(logConsumptionUrl, store);
  //     await waitFor(() => screen.getByRole('heading', {name: logConsumptionHeading}));
  //     await userEvent.click(screen.getByLabelText('Food'));
  //     await userEvent.type(screen.getByLabelText('Food'), food.name.substr(0, 2));
  //     await waitFor(() => screen.getByText(food.name));
  //     await userEvent.click(screen.getByText(food.name));
  //     await userEvent.click(screen.getByRole('button', {name: 'Submit Log'}));
  //     await waitFor(() => screen.getByText(`Well done! Consumption of "${food.name}" logged.`));
  //     await waitFor(() => screen.getByRole('heading', {name: logConsumptionHeading}));
  // TODO: Check parameters of backend call
  //     expect(backend.reqCreateConsumption).toHaveBeenCalled();
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
