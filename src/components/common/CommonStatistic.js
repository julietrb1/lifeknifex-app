import React from 'react';
import PropTypes from 'prop-types';
import {Statistic} from "semantic-ui-react";

const CommonStatistic = props => {
    return (
        <Statistic>
            <Statistic.Value>{props.list.count ? props.list.count : '--'}</Statistic.Value>
            <Statistic.Label>{props.label}{props.list.count && props.list.count === 1 ? '' : 's'}</Statistic.Label>
        </Statistic>
    );
};

CommonStatistic.propTypes = {
    list: PropTypes.array.isRequired,
    label: PropTypes.string.isRequired
};

export default CommonStatistic;