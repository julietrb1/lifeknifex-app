import { screen, waitFor } from '@testing-library/react';
import { EnhancedStore } from '@reduxjs/toolkit';
import * as backend from '../../backend';
import { RootState } from '../../redux/rootReducer';
import {
  generateGoal,
  getTestStore,
  renderNode,
  setGoalResponse,
  setUpMockBackend,
} from '../../testUtils';

jest.mock('./../../backend');
const mockBackend = backend as jest.Mocked<typeof backend>;
const routeUrl = '/goals/answer';
let store: EnhancedStore<RootState>;
const allDoneMessage = /All done!/;

describe('Answer', () => {
  beforeEach(() => {
    store = getTestStore();
    setUpMockBackend(mockBackend);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show all done with all goals answered', async () => {
    setGoalResponse(store, [generateGoal('Sample question', 1)]);
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: allDoneMessage }));
    expect(backend.reqGetAllGoals).not.toHaveBeenCalled();
  });

  it('should show the first yesno goal when not answered', async () => {
    setGoalResponse(store, [generateGoal(
      'Sample question', undefined, 'yesno',
    )]);
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: /Did I sample question?/ }));
    await waitFor(() => screen.getByRole('button', { name: /No/ }));
    expect(backend.reqGetAllGoals).not.toHaveBeenCalled();
  });

  it('should show the first likert goal when not answered', async () => {
    setGoalResponse(store, [generateGoal(
      'Sample question', undefined, 'likert',
    )]);
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: /Did I sample question?/ }));
    await waitFor(() => screen.getByRole('button', { name: /Effectively/ }));
    expect(backend.reqGetAllGoals).not.toHaveBeenCalled();
  });
});
