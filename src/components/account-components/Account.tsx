import React from 'react';
import HeaderBar from '../common-components/HeaderBar';
import BreadcrumbSet from '../common-components/BreadcrumbSet';
import {Button} from 'semantic-ui-react';
import {getAccount, logOut} from '../../backend';
import {useHistory} from 'react-router-dom';
import axios from "axios";

const sections = [
    {name: 'Account'}
];

const Account: React.FC = () => {
    const [account, setAccount] = React.useState<any>();
    const history = useHistory();
    const cancelToken = axios.CancelToken.source();

    React.useEffect(() => {
        (async () => {
            if (account) return;
            const fetchedAccount = await getAccount(cancelToken);
            setAccount(fetchedAccount);
        })();
    }, [cancelToken, account]);

    const logOutLocal = () => {
        logOut()
            .then(() => history.replace('/login'));
    };

    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title="Account" icon='account'/>
        <div className="main-links">
            <span>{account ? 'Logged In' : 'Loading Account...'}</span>
            <Button onClick={logOutLocal}>Log Out</Button>
        </div>
    </div>;
};

export default Account;