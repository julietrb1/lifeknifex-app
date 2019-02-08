import React from "react";
import './HeaderBar.scss';
import {APP_TITLE} from '../../constants';
import PropTypes from 'prop-types';
import {Header} from 'semantic-ui-react';

const HeaderBar = (props) => {
    document.title = props.title ? `${props.title} - ${APP_TITLE}` : APP_TITLE;
    return <Header image={`/img/home_cover_${props.icon}.svg`} as='h1' textAlign='center' content={props.title}/>;
};

HeaderBar.propTypes = {
    title: PropTypes.string.isRequired,
    icon: PropTypes.string.isRequired,
};

export default HeaderBar;
