import React from 'react';
import { Menu } from 'semantic-ui-react';
import { useHistory, useLocation } from 'react-router-dom';
import './TopNav.scss';

const TopNav: React.FC = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const sections = [
    { name: 'nutrition', path: '/nutrition' },
    { name: 'goals', path: '/goals' },
    { name: 'account', path: '/account' },
  ];
  return (
    <Menu text className="topnav-menu">
      <Menu.Item header>Sort By</Menu.Item>
      <div className="topnav-sections">
        {sections.map(({ name, path }) => (
          <Menu.Item
            key={`topnav-${name}`}
            name={name}
            active={pathname.startsWith(path)}
            onClick={() => history.push(path)}
          />
        ))}
      </div>
    </Menu>
  );
};

export default TopNav;
