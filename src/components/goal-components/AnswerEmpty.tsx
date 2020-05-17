import React from 'react';
import { Link } from 'react-router-dom';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import Image from 'react-bootstrap/Image';
import { COLOR_GOALS } from '../../constants';

const AnswerEmpty = () => (
  <Card className="text-center">
    <Card.Body>
      <Image className="placeholder-image" src="/img/undraw_i_can_fly_7egl.svg"/>
      <h3 className="mb-5">All done!</h3>
      <Button as={Link} to="/goals" color={COLOR_GOALS}>Back to Goals</Button>
    </Card.Body>
  </Card>
);

AnswerEmpty.propTypes = {};

export default AnswerEmpty;
