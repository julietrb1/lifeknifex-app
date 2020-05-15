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
describe('Login', () => {
  beforeEach(async () => {
    store = getTestStore(true);
    setUpMockBackend(mockBackend);
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
    await userEvent.type(screen.getByLabelText(passwordLabel), 'invalid');
    await userEvent.click(screen.getByRole('button', { name: logInButtonText }));
    await waitFor(() => screen.getByText(missingCredentialMessage));
  });

  it('should show error with no password', async () => {
    renderNode(routeUrl, store);
    await userEvent.type(screen.getByLabelText(usernameLabel), 'invalid');
    await userEvent.click(screen.getByRole('button', { name: logInButtonText }));
    await waitFor(() => screen.getByText(missingCredentialMessage));
  });

  it('should show error with no username and password', async () => {
    renderNode(routeUrl, store);
    await userEvent.click(screen.getByRole('button', { name: logInButtonText }));
    await waitFor(() => screen.getByText(missingCredentialMessage));
  });

  it('should accept valid credentials', async () => {
    mockBackend.reqLogIn.mockResolvedValueOnce(
      generateAxiosResponse<IAccount>({ username: testUsername }),
    );

    renderNode(routeUrl, store);
    await userEvent.type(screen.getByLabelText(usernameLabel), testUsername);
    await userEvent.type(screen.getByLabelText(passwordLabel), 'pass');
    await userEvent.click(screen.getByRole('button', { name: logInButtonText }));
    await waitFor(() => screen.getByRole('heading', { name: homeHeading }));
  });
});
