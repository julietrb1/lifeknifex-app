import React from 'react';
import HeaderBar from '../HeaderBar/HeaderBar';
import PropTypes from 'prop-types';
import BreadcrumbSet from '../common/BreadcrumbSet/BreadcrumbSet';
import {Button} from 'semantic-ui-react';
import {getAccount, logOut} from '../../Backend';
import RequestComponent from '../common/RequestComponent/RequestComponent';

const sections = [
    {name: 'Account'}
];

class Account extends RequestComponent {
    constructor(props) {
        super(props);
        this.state = {
            account: null
        };
    }

    componentDidMount() {
        getAccount(this.cancelToken)
            .then(account => {
                this.setState({
                    account: account
                });
            });
    }

    logOutLocal = () => {
        logOut(this.cancelToken)
            .then(() => this.props.history.replace('/login'));
    };

    render() {
        return <div>
            <BreadcrumbSet sections={sections}/>
            <HeaderBar title="Account" icon='account'/>
            <div className="main-links">
                <span>{this.state.account ? this.state.account.username : 'Loading Account...'}</span>
                <Button onClick={this.logOutLocal}>Log Out</Button>
            </div>
        </div>;
    }
}

Account.propTypes = {
    history: PropTypes.object
};

export default Account;