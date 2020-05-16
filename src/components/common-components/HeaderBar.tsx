import React from 'react';
import './HeaderBar.scss';
import { APP_TITLE } from '../../constants';

export interface IHeaderBarProps {
  title: string;
  icon: string;
}

const HeaderBar: React.FC<IHeaderBarProps> = ({ title }: IHeaderBarProps) => {
  document.title = title ? `${title} - ${APP_TITLE}` : APP_TITLE;
  return <h2>{title}</h2>;
};

export default HeaderBar;
