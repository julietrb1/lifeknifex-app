import { screen, waitFor } from '@testing-library/react';
import { EnhancedStore } from '@reduxjs/toolkit';
import userEvent from '@testing-library/user-event';
import * as backend from '../../backend';
import {
  getTestStore, renderNode, setUpMockBackend, testUsername,
} from '../../testUtils';
import { RootState } from '../../redux/rootReducer';
import { logoutPerform } from '../../features/auth/authSlice';

jest.mock('./../../backend');
const routeUrl = '/account';
let store: EnhancedStore<RootState>;
const mockBackend = backend as jest.Mocked<typeof backend>;

describe('Account', () => {
  beforeEach(() => {
    store = getTestStore();
    setUpMockBackend(mockBackend);
  });

  it('log out when no account set', async () => {
    await store.dispatch(logoutPerform());
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: 'Log In' }));
  });

  it('shows account when logged in', async () => {
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: testUsername }));
  });

  it('should log out when button clicked', async () => {
    renderNode(routeUrl, store);
    await userEvent.click(screen.getByRole('button', { name: /Log out/ }));
    await waitFor(() => screen.getByRole('heading', { name: 'Log In' }));
  });
});
