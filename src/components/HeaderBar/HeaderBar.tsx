import React from "react";
import './HeaderBar.scss';
import {APP_TITLE} from '../../constants';
import {Header} from 'semantic-ui-react';
import {IHeaderBarProps} from "./IHeaderBarProps";

const HeaderBar: React.FC<IHeaderBarProps> = (props) => {
    document.title = props.title ? `${props.title} - ${APP_TITLE}` : APP_TITLE;
    return <Header image={`/img/home_cover_${props.icon}.svg`} as='h1' textAlign='center' content={props.title}/>;
};

export default HeaderBar;
