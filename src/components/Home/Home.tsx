import { Link } from 'react-router-dom';
import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import {
  Card, Icon, Image, Label,
} from 'semantic-ui-react';
import * as constants from '../../constants';
import { APP_TITLE } from '../../constants';
import './Home.scss';
import GoalDashboard from '../common-components/GoalDashboard';

const Home: React.FC = () => {
  const comingSoonBadge = (
    <Card.Meta>
      <Label>
        <Icon name="gem" />
        {' '}
        Coming Soon
      </Label>
    </Card.Meta>
  );
  const alphaBadge = (
    <Card.Meta>
      <Label size="small">
        <Icon name="bug" />
        {' '}
        Alpha
      </Label>
    </Card.Meta>
  );
  const betaBadge = (
    <Card.Meta>
      <Label size="small">
        <Icon name="bug" />
        {' '}
        Beta
      </Label>
    </Card.Meta>
  );

  document.title = `Home - ${APP_TITLE}`;
  return (
    <div>
      <ButtonGroup>
        <Button as={Link} to="/nutrition" variant="primary">Visit Nutrition</Button>
        <Button as={Link} to="/nutrition/log" variant="outline-primary">Log</Button>
        <Button as={Link} to="/nutrition/library" variant="outline-primary">Library</Button>
      </ButtonGroup>
      <h2>Goals</h2>
      <GoalDashboard />
      <Button as={Link} to="/goals" variant="outline-primary">Visit Goals</Button>
      <Button as={Link} to="/account" variant="outline-primary">Visit Account</Button>
      <Card.Group centered>
        <Card color={constants.COLOR_NUTRITION}>
          <Card.Content>
            <Image src="/img/undraw_pizza_sharing.svg" />
            <Card.Header as="h3">Nutrition</Card.Header>
            <Card.Meta>{betaBadge}</Card.Meta>
            <Card.Description>
              Logging what you eat and drink is the first step to becoming healthier,
              little by little.
            </Card.Description>
          </Card.Content>
          <Card.Content extra />
        </Card>

        <Card color={constants.COLOR_GOALS}>
          <Card.Content>
            <Image src="/img/undraw_i_can_fly_7egl.svg" />
            <Card.Header as="h3">Goals</Card.Header>
            <Card.Meta>{alphaBadge}</Card.Meta>
            <Card.Description>
              If you have an aspiration to achieve something big in life,
              start here. Every bit counts.
            </Card.Description>
          </Card.Content>
          <Card.Content extra />
        </Card>

        <Card color={constants.COLOR_CAREER}>
          <Card.Content>
            <Image src="/img/undraw_career_progress_ivdb.svg" />
            <Card.Header as="h3">Career</Card.Header>
            <Card.Description>
              If you don&apos;t track how well you&apos;re doing in your job, how will you see
              improvement? Start here.
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            {comingSoonBadge}
          </Card.Content>
        </Card>

        <Card color={constants.COLOR_MOOD}>
          <Card.Content>
            <Image src="/img/undraw_mindfulness_scgo.svg" />
            <Card.Header as="h3">Mood</Card.Header>
            <Card.Description>
              If there&apos;s one thing that counts more than emotions,
              it&apos;s your mood. Don&apos;t
              let it run you over.
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            {comingSoonBadge}
          </Card.Content>
        </Card>

        <Card color={constants.COLOR_SCORE}>
          <Card.Content>
            <Image src="/img/undraw_checking_boxes_2ibd.svg" />
            <Card.Header as="h3">Score</Card.Header>
            <Card.Description>
              There&apos;s no reason why organisation shouldn&apos;t
              be fun! Keep track of your progress
              and success here.
            </Card.Description>
          </Card.Content>
          <Card.Content extra>
            {comingSoonBadge}
          </Card.Content>
        </Card>

        <Card color={constants.COLOR_ACCOUNT}>
          <Card.Content>
            <Image src="/img/undraw_security_o890.svg" />
            <Card.Header as="h3">Account</Card.Header>
            <Card.Meta>{alphaBadge}</Card.Meta>
            <Card.Description>
              Need to log out, or manage your account? Get all of your paperwork and maintenance
              done here.
            </Card.Description>
          </Card.Content>
          <Card.Content extra />
        </Card>
      </Card.Group>
    </div>
  );
};

export default Home;
