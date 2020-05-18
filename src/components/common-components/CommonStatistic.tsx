import React from 'react';

interface ICommonStatisticProps {
  count: number | string;
  label: string;
}

const CommonStatistic: React.FC<ICommonStatisticProps> = (
  { count, label }: ICommonStatisticProps,
) => (
  <div className="dashboard-item">
    <div className="dashboard-value">{count ? count.toLocaleString() : '--'}</div>
    <div className="dashboard-label">{label}</div>
  </div>
);

export default CommonStatistic;
