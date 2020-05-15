import React from 'react';
import { Button, Icon, Image, Segment, } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { COLOR_GOALS } from '../../constants';
// import PropTypes from 'prop-types';

const AnswerEmpty = () => (
  <Segment textAlign="center" placeholder>
    <Image className="placeholder-image" src="/img/undraw_i_can_fly_7egl.svg" size="medium" />
    <h3>All done!</h3>
    <Button animated="vertical" as={Link} to="/goals" color={COLOR_GOALS}>
      <Button.Content visible>Back to Goals</Button.Content>
      <Button.Content hidden>
        <Icon name="target" />
      </Button.Content>
    </Button>
  </Segment>
);

AnswerEmpty.propTypes = {};

export default AnswerEmpty;
