import React from 'react';
import {Statistic} from "semantic-ui-react";

interface ICommonStatisticProps {
    count: number | string;
    label: string;
}

const CommonStatistic: React.FC<ICommonStatisticProps> = props => {
    return (
        <Statistic>
            <Statistic.Value>{props.count ? props.count.toLocaleString() : '--'}</Statistic.Value>
            <Statistic.Label>{props.label}</Statistic.Label>
        </Statistic>
    );
};

export default CommonStatistic;