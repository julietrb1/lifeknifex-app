import { fireEvent, screen, waitFor } from '@testing-library/react';
import { EnhancedStore } from '@reduxjs/toolkit';
import * as backend from '../../backend';
import { RootState } from '../../redux/rootReducer';
import {
  addFoodToStore, getTestStore, renderNode, setUpMockBackend,
} from '../../testUtils';

jest.mock('./../../backend');
const routeUrl = '/nutrition/library';
let store: EnhancedStore<RootState>;
const emptyFoodsMessage = 'You don\'t have any foods yet.';
const mockBackend = backend as jest.Mocked<typeof backend>;

describe('NutritionLibrary', () => {
  beforeEach(() => {
    store = getTestStore();
    setUpMockBackend(mockBackend);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show empty food list', async () => {
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: emptyFoodsMessage }));
    expect(backend.reqGetAllFoods).toBeCalledTimes(1);
  });

  it('should show foods', async () => {
    const food = addFoodToStore(store, 'My food');
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: food.name }));
  });

  it('should not perform any requests when loaded', async () => {
    store.getState().foodState.foodResponse = {};
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: emptyFoodsMessage }));
    expect(mockBackend.reqGetAllFoods).not.toBeCalled();
  });

  it('should navigate to Log Consumption when Log clicked', async () => {
    const foodName = 'My food';
    addFoodToStore(store, foodName);
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: foodName }));
    await fireEvent.click(screen.getByRole('button', { name: 'Log' }));
    await waitFor(() => screen.getByRole('heading', { name: 'Log Consumption' }));
  });

  it('should navigate to new food form with no foods', async () => {
    renderNode(routeUrl, store);
    fireEvent.click(screen.getByRole('button', { name: 'Let\'s Create One' }));
    await waitFor(() => screen.getByRole('heading', { name: 'New Food' }));
  });

  it('should navigate to new food form with foods', async () => {
    addFoodToStore(store, 'My food');
    renderNode(routeUrl, store);
    fireEvent.click(screen.getByRole('button', { name: 'New Food' }));
    await waitFor(() => screen.getByRole('heading', { name: 'New Food' }));
  });

  it('should navigate to edit food form', async () => {
    addFoodToStore(store, 'My food');
    renderNode(routeUrl, store);
    fireEvent.click(screen.getByRole('button', { name: 'Edit' }));
    await waitFor(() => screen.getByRole('heading', { name: 'Edit Food' }));
  });

  it('should show an empty archived message', async () => {
    renderNode(routeUrl, store);
    fireEvent.click(screen.getByRole('checkbox'));
    await waitFor(() => screen.getByRole('heading', { name: 'No archived foods for you!' }));
  });

  it('should show archived foods', async () => {
    const foodName = 'My food';
    addFoodToStore(store, foodName, true);
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: emptyFoodsMessage }));
    fireEvent.click(screen.getByRole('checkbox'));
    await waitFor(() => screen.getByRole('heading', { name: foodName }));
  });
});
