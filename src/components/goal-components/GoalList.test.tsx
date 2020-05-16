import { fireEvent, screen, waitFor } from '@testing-library/react';
import { EnhancedStore } from '@reduxjs/toolkit';
import * as backend from '../../backend';
import { RootState } from '../../redux/rootReducer';
import {
  addGoalToStore,
  getTestStore,
  renderNode,
  setGoalResponse,
  setUpMockBackend,
} from '../../testUtils';

jest.mock('./../../backend');
const mockBackend = backend as jest.Mocked<typeof backend>;
const routeUrl = '/goals';
let store: EnhancedStore<RootState>;
const emptyGoalsMessage = 'You don\'t have any goals yet.';

describe('GoalForm', () => {
  beforeEach(() => {
    store = getTestStore();
    setUpMockBackend(mockBackend);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show empty goal list', async () => {
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: emptyGoalsMessage }));
    expect(backend.reqGetAllGoals).toBeCalledTimes(1);
  });

  it('should show goals', async () => {
    const goal = addGoalToStore(store, 'My goal');
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: goal.question }));
  });

  it('should not perform any requests when loaded', async () => {
    setGoalResponse(store, []);
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: emptyGoalsMessage }));
    expect(backend.reqGetAllGoals).not.toBeCalled();
  });

  it('should navigate to GoalForm when New Goal clicked', async () => {
    renderNode(routeUrl, store);
    fireEvent.click(screen.getByRole('button', { name: 'New Goal' }));
    await waitFor(() => screen.getByRole('heading', { name: 'New Goal' }));
  });
});
