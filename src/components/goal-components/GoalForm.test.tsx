import { screen } from '@testing-library/react';
import { EnhancedStore } from '@reduxjs/toolkit';
import * as backend from '../../backend';
import { RootState } from '../../redux/rootReducer';
import { addGoalToStore, getTestStore, renderNode, setUpMockBackend, } from '../../testUtils';

jest.mock('./../../backend');
const mockBackend = backend as jest.Mocked<typeof backend>;
const routeUrl = '/goals/manage/';
let store: EnhancedStore<RootState>;

const goalQuestion = 'Question';
const questionLabel = /Question/;
describe('GoalForm', () => {
  beforeEach(() => {
    store = getTestStore();
    setUpMockBackend(mockBackend);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should show goal from store', async () => {
    const goal = addGoalToStore(store, goalQuestion);

    renderNode(`${routeUrl}${goal.id}`, store);
    expect((screen.getByLabelText(questionLabel) as HTMLInputElement).value).toEqual(goalQuestion);
    expect((screen.getByLabelText(/At least every/) as HTMLInputElement).checked).toBeTruthy();
    expect((screen.getByLabelText(/Yes\/No/) as HTMLInputElement).checked).toBeTruthy();
    // TODO: Check start date (or should it be removed altogether?)
    expect(backend.reqGetAllGoals).not.toBeCalled();
  });
});
