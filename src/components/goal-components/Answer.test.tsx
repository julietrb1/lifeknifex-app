import { screen, waitFor } from '@testing-library/react';
import { EnhancedStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
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

const effectivelyLabel = /Effectively/;
const nextButtonText = /Next/;
const backButtonText = /Back/;
const finishButtonText = /Finish/;
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

  it('should go forward/back a question in post mode', async () => {
    await setGoalResponse(store, [
      generateGoal(goalQuestion, 1),
      generateGoal('otherq', 1, 'likert'),
    ]);

    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: questionText }));
    expect((screen.getByLabelText(/Yes/) as HTMLInputElement).checked).toBeTruthy();
    await userEvent.click(screen.getByLabelText(/No/));
    await userEvent.click(screen.getByRole('button', { name: nextButtonText }));
    await waitFor(() => screen.getByRole('heading', { name: /Did I otherq?/ }));
    await userEvent.click(screen.getByLabelText(effectivelyLabel));
    await userEvent.click(screen.getByRole('button', { name: backButtonText }));
    await waitFor(() => screen.getByRole('heading', { name: questionText }));
    expect((screen.getByLabelText(/No/) as HTMLInputElement).checked).toBeTruthy();
    expect(backend.reqUpdateAnswer).toBeCalledTimes(2);
  });

  it('should set a likert goal in post mode', async () => {
    const goal = generateGoal(
      goalQuestion, 1, 'likert',
    );
    setGoalResponse(store, [goal]);

    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: questionText }));
    await waitFor(() => screen.getByRole('radio', { name: effectivelyLabel }));
    userEvent.click(screen.getByRole('radio', { name: effectivelyLabel }));
    await userEvent.click(screen.getByRole('button', { name: finishButtonText }));
    await waitFor(() => screen.getByRole('heading', { name: allDoneMessage }));
    expect(backend.reqUpdateAnswer).toBeCalledTimes(1);
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

  it('should set a likert goal in pre mode', async () => {
    const goal = generateGoal(
      goalQuestion, undefined, 'likert',
    );
    setGoalResponse(store, [goal]);

    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: questionText }));
    await waitFor(() => screen.getByRole('button', { name: effectivelyLabel }));
    userEvent.click(screen.getByRole('button', { name: effectivelyLabel }));
    await waitFor(() => screen.getByRole('heading', { name: allDoneMessage }));
    expect(backend.reqCreateAnswer).toBeCalledTimes(1);
  });
});
