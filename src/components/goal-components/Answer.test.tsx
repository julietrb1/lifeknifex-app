import { screen, waitFor } from '@testing-library/react';
import { EnhancedStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import moment from 'moment';
import * as backend from '../../backend';
import { RootState } from '../../redux/rootReducer';
import {
  generateAxiosResponse,
  generateGoal,
  getTestStore,
  renderNode,
  setGoalResponse,
  setUpMockBackend,
} from '../../testUtils';
import IAnswer from '../../models/IAnswer';
import { BACKEND_DATE_FORMAT } from '../../constants';

jest.mock('./../../backend');
const mockBackend = backend as jest.Mocked<typeof backend>;
const routeUrl = '/goals/answer';
let store: EnhancedStore<RootState>;
const allDoneMessage = /All done!/;

const effectivelyLabel = /Effectively/;
const questionText = /Did I sample question?/;
const goalQuestion = 'Sample question';
describe('Answer', () => {
  beforeEach(() => {
    store = getTestStore();
    setUpMockBackend(mockBackend);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show all done with all goals answered', async () => {
    setGoalResponse(store, [generateGoal(goalQuestion, 1)]);

    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: allDoneMessage }));
    expect(backend.reqGetAllGoals).not.toBeCalled();
  });

  it('should show the first yesno goal when not answered', async () => {
    setGoalResponse(store, [generateGoal(
      goalQuestion, undefined, 'yesno',
    )]);

    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: questionText }));
    await waitFor(() => screen.getByRole('button', { name: /No/ }));
    expect(backend.reqGetAllGoals).not.toBeCalled();
  });

  it('should show the first likert goal when not answered', async () => {
    setGoalResponse(store, [generateGoal(
      goalQuestion, undefined, 'likert',
    )]);

    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: questionText }));
    await waitFor(() => screen.getByRole('button', { name: effectivelyLabel }));
    expect(backend.reqGetAllGoals).not.toBeCalled();
  });

  it('should set a likert goal in pre mode', async () => {
    const goal = generateGoal(
      goalQuestion, undefined, 'likert',
    );
    setGoalResponse(store, [goal]);
    mockBackend.reqCreateAnswer.mockResolvedValueOnce(generateAxiosResponse<IAnswer>({
      url: '',
      id: goal.id,
      value: 1,
      date: moment().format(BACKEND_DATE_FORMAT),
      goal: '',
    }));

    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: questionText }));
    await waitFor(() => screen.getByRole('button', { name: effectivelyLabel }));
    userEvent.click(screen.getByRole('button', { name: effectivelyLabel }));
    await waitFor(() => screen.getByRole('heading', { name: allDoneMessage }));
    expect(backend.reqCreateAnswer).toBeCalledTimes(1);
  });
});
