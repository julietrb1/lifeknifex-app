import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar';
import BreadcrumbSet from '../common/BreadcrumbSet/BreadcrumbSet';
import {Button} from 'semantic-ui-react';
import {getAccount, logOut} from '../../Backend';
import {useHistory} from 'react-router-dom';
import axios from "axios";

const sections = [
    {name: 'Account'}
];

const AccountFC: React.FC = () => {
    const [account, setAccount] = React.useState<any>();
    const history = useHistory();
    const cancelToken = axios.CancelToken.source();

    React.useEffect(() => {
        (async () => {
            const account = await getAccount(cancelToken);
            setAccount(account);
        })();
    }, [cancelToken]);

    const logOutLocal = () => {
        logOut()
            .then(() => history.replace('/login'));
    };

    return <div>
        <BreadcrumbSet sections={sections}/>
        <HeaderBar title="Account" icon='account'/>
        <div className="main-links">
            <span>{account ?? 'Loading Account...'}</span>
            <Button onClick={logOutLocal}>Log Out</Button>
        </div>
    </div>;
};

export default AccountFC;