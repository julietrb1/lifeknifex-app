import React from 'react';
import HeaderBar from '../common-components/HeaderBar';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import {Button} from 'semantic-ui-react';
import axios from "axios";
import {useDispatch, useSelector} from "react-redux";
import {selectAccount} from "../../features/auth/authSelectors";
import {fetchAccount, logOut} from "../../features/auth/authSlice";

const sections = [
    {name: 'Account'}
];

const Account: React.FC = () => {
    const account = useSelector(selectAccount);
    const dispatch = useDispatch();
    const cancelToken = axios.CancelToken.source();

    React.useEffect(() => {
        if (!account) dispatch(fetchAccount());
    }, [cancelToken, account, dispatch]);

    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title="Account" icon='account'/>
        <div className="main-links">
            <span>{account?.username ?? 'Unknown username'}</span>
            <Button onClick={() => dispatch(logOut())}>Log Out</Button>
        </div>
    </div>;
};

export default Account;