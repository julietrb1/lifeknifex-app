import React from 'react';
import './HeaderBar.scss';
import { Header } from 'semantic-ui-react';
import { APP_TITLE } from '../../constants';

export interface IHeaderBarProps {
  title: string;
  icon: string;
}

const HeaderBar: React.FC<IHeaderBarProps> = ({ title, icon }: IHeaderBarProps) => {
  document.title = title ? `${title} - ${APP_TITLE}` : APP_TITLE;
  return <Header image={`/img/home_cover_${icon}.svg`} as="h1" textAlign="center" content={title} />;
};

export default HeaderBar;
