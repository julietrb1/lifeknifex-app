import { screen, waitFor } from '@testing-library/react';
import { EnhancedStore } from '@reduxjs/toolkit';
import { getTestStore, renderNode } from '../../testUtils';
import { RootState } from '../../redux/rootReducer';
import { logoutPerform } from '../../features/auth/authSlice';

const routeUrl = '/account';
let store: EnhancedStore<RootState>;

describe('Account', () => {
  beforeEach(() => {
    store = getTestStore();
  });

  it('log out when no account set', async () => {
    await store.dispatch(logoutPerform());
    renderNode(routeUrl, store);
    await waitFor(() => screen.getByRole('heading', { name: 'Log In' }));
  });
});
