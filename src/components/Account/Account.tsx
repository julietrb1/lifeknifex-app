import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar';
import BreadcrumbSet from '../common/BreadcrumbSet/BreadcrumbSet';
import {Button} from 'semantic-ui-react';
import {getAccount, logOut} from '../../Backend';
import RequestComponent from '../common/RequestComponent/RequestComponent';
import {RouteComponentProps} from "react-router";

const sections = [
    {name: 'Account'}
];

class Account extends RequestComponent<RouteComponentProps> {
    state = {
        account: null
    };

    componentDidMount() {
        getAccount(this.cancelToken)
            .then(account => {
                this.setState({
                    account: account
                });
            });
    }

    logOutLocal = () => {
        logOut()
            .then(() => this.props.history.replace('/login'));
    };

    render() {
        return <div>
            <BreadcrumbSet sections={sections}/>
            <HeaderBar title="Account" icon='account'/>
            <div className="main-links">
                <span>Loading Account...</span>
                <Button onClick={this.logOutLocal}>Log Out</Button>
            </div>
        </div>;
    }
}

export default Account;