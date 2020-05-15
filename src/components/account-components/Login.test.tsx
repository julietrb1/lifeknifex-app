import { screen, waitFor } from '@testing-library/react';
import { EnhancedStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import * as backend from '../../backend';
import {
  generateAxiosResponse,
  getTestStore,
  renderNode,
  setUpMockBackend,
  testUsername,
} from '../../testUtils';
import { RootState } from '../../redux/rootReducer';
import { loginSuccess } from '../../features/auth/authSlice';
import IAccount from '../../models/IAccount';

jest.mock('./../../backend');
const routeUrl = '/login';
let store: EnhancedStore<RootState>;
const mockBackend = backend as jest.Mocked<typeof backend>;

const loginHeading = /Log In/;
const homeHeading = /LifeKnifeX/;
const usernameLabel = /Username/;
const passwordLabel = /Password/;
const logInButtonText = /Log in/;
const missingCredentialMessage = /Username and password required/;

const performTestLogin = async (
  username: string, password: string, headingExpected: boolean, expectedText: RegExp) => {
  await userEvent.type(screen.getByLabelText(usernameLabel), username);
  await userEvent.type(screen.getByLabelText(passwordLabel), password);
  await userEvent.click(screen.getByRole('button', { name: logInButtonText }));
  await waitFor(() => (headingExpected
    ? screen.getByRole('heading', { name: expectedText })
    : screen.getByText(expectedText)));
};

describe('Login', () => {
  beforeEach(async () => {
    store = getTestStore(true);
    setUpMockBackend(mockBackend);
  });

  afterEach(async () => {
    jest.clearAllMocks();
  });

  it('should stay on login when no account present', async () => {
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: loginHeading }));
  });

  it('should redirect to home when account present', async () => {
    await store.dispatch(loginSuccess({ username: testUsername }));

    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: homeHeading }));
  });

  it('should show error with no username', async () => {
    renderNode(routeUrl, store);
    await performTestLogin('', 'pass', false, missingCredentialMessage);
    expect(mockBackend.reqLogIn).not.toBeCalled();
  });

  it('should show error with no password', async () => {
    renderNode(routeUrl, store);
    await performTestLogin(testUsername, '', false, missingCredentialMessage);
    expect(mockBackend.reqLogIn).not.toBeCalled();
  });

  it('should show error with no username and password', async () => {
    renderNode(routeUrl, store);
    // Required to make the form work
    await performTestLogin('', '', false, missingCredentialMessage);
    expect(mockBackend.reqLogIn).not.toBeCalled();
  });

  it('should accept valid credentials', async () => {
    mockBackend.reqLogIn.mockResolvedValueOnce(
      generateAxiosResponse<IAccount>({ username: testUsername }),
    );

    renderNode(routeUrl, store);
    await performTestLogin(testUsername, 'pass', true, homeHeading);
    expect(mockBackend.reqLogIn).toBeCalledTimes(1);
  });
});
