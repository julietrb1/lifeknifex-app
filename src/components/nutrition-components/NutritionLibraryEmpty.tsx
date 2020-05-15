import React from 'react';
import { Button, Icon, Image, Segment, } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import { COLOR_NUTRITION } from '../../constants';

export interface INutritionLibraryEmptyProps {
  isArchivedVisible: boolean;
}

const NutritionLibraryEmpty: React.FC<INutritionLibraryEmptyProps> = (
  { isArchivedVisible }: INutritionLibraryEmptyProps,
) => (
  <Segment textAlign="center" placeholder>
    <Image className="placeholder-image" src="/img/undraw_pizza_sharing.svg" size="medium" />
    <h3>
      {isArchivedVisible
        ? 'No archived foods for you!'
        : 'You don\'t have any foods yet.'}
    </h3>
    {isArchivedVisible
      ? null
      : (
        <Button animated="vertical" as={Link} to="/nutrition/library/new" color={COLOR_NUTRITION}>
          <Button.Content visible>Let&apos;s Create One</Button.Content>
          <Button.Content hidden>
            <Icon name="plus" />
          </Button.Content>
        </Button>
      )}
  </Segment>
);

export default NutritionLibraryEmpty;
