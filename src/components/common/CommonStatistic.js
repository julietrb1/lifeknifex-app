import React from 'react';
import PropTypes from 'prop-types';
import {Statistic} from "semantic-ui-react";

const CommonStatistic = props => {
    return (
        <Statistic>
            <Statistic.Value>{props.count ? props.count.toLocaleString() : '--'}</Statistic.Value>
            <Statistic.Label>{props.label}{props.count === 1 ? '' : 's'}</Statistic.Label>
        </Statistic>
    );
};

CommonStatistic.propTypes = {
    count: PropTypes.number,
    label: PropTypes.string.isRequired
};

export default CommonStatistic;