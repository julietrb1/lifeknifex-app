import React from 'react';
import { Menu } from 'semantic-ui-react';
import { useHistory, useLocation } from 'react-router-dom';

const TopNav: React.FC = () => {
  const { pathname } = useLocation();
  const history = useHistory();
  const sections = [
    { name: 'nutrition', path: '/nutrition' },
    { name: 'goals', path: '/goals' },
    { name: 'account', path: '/account' },
  ];
  return (
    <Menu text>
      <Menu.Item header>Sort By</Menu.Item>
      {sections.map(({ name, path }) => (
        <Menu.Item
          key={`topnav-${name}`}
          name={name}
          active={pathname.startsWith(path)}
          onClick={() => history.push(path)}
        />
      ))}
    </Menu>
  );
};

export default TopNav;
