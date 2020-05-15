import React from 'react';
import { Statistic } from 'semantic-ui-react';

interface ICommonStatisticProps {
  count: number | string;
  label: string;
}

const CommonStatistic: React.FC<ICommonStatisticProps> = (
  { count, label }: ICommonStatisticProps,
) => (
  <Statistic>
    <Statistic.Value>{count ? count.toLocaleString() : '--'}</Statistic.Value>
    <Statistic.Label>{label}</Statistic.Label>
  </Statistic>
);

export default CommonStatistic;
