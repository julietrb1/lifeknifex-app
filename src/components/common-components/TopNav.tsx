import React from 'react';
import Navbar from 'react-bootstrap/Navbar';
import Nav from 'react-bootstrap/Nav';
import { Link, useLocation } from 'react-router-dom';
import './TopNav.scss';

const TopNav: React.FC = () => {
  const { pathname } = useLocation();
  const sections = [
    { name: 'Nutrition', path: '/nutrition' },
    { name: 'Goals', path: '/goals' },
    { name: 'Account', path: '/account' },
  ];
  return (
    <Navbar bg="light" expand="lg" className="topnav">
      <Navbar.Brand as={Link} to="/">LifeKnifeX</Navbar.Brand>
      <Navbar.Toggle aria-controls="basic-navbar-nav" />
      <Navbar.Collapse id="basic-navbar-nav">
        <Nav className="mr-auto">
          {sections.map(({ name, path }) => (
            <Nav.Link
              key={path}
              active={pathname.startsWith(path)}
              as={Link}
              to={path}
            >
              {name}
            </Nav.Link>
          ))}
        </Nav>
      </Navbar.Collapse>
    </Navbar>
  );
};

export default TopNav;
