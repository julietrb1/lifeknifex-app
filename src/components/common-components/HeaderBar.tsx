import React from 'react';
import './HeaderBar.scss';
import { APP_TITLE } from '../../constants';

export interface IHeaderBarProps {
  title: string;
  actions?: React.ReactNode;
}

const HeaderBar: React.FC<IHeaderBarProps> = ({ title, actions }: IHeaderBarProps) => {
  document.title = title ? `${title} - ${APP_TITLE}` : APP_TITLE;
  return (
    <div className="clearfix mb-4">
      <h2 className="d-inline-block mb-4 text-wrap">{title}</h2>
      <div className="float-right">{actions}</div>
    </div>
  );
};

export default HeaderBar;
