import React from 'react';
import { Button, Header } from 'semantic-ui-react';
import axios from 'axios';
import { useDispatch, useSelector } from 'react-redux';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import HeaderBar from '../common-components/HeaderBar';
import { selectAccount } from '../../features/auth/authSelectors';
import { fetchAccount, logOut } from '../../features/auth/authSlice';

const sections = [
  { name: 'Account' },
];

const Account: React.FC = () => {
  const account = useSelector(selectAccount);
  const dispatch = useDispatch();
  const cancelToken = axios.CancelToken.source();

  React.useEffect(() => {
    (async () => {
      try {
        if (!account) {
          await dispatch(fetchAccount());
        }
      } catch (e) {
        // Do nothing
      }
    })();
  }, [cancelToken, account, dispatch]);

  return (
    <div>
      <BreadcrumbSet sections={sections} />
      <HeaderBar title="Account" icon="account" />
      <div className="main-links">
        <Header as="h2">{account?.username ?? 'Unknown username'}</Header>
        <Button onClick={() => dispatch(logOut())}>Log Out</Button>
      </div>
    </div>
  );
};

export default Account;
