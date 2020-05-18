import React from 'react';
import { Image } from 'semantic-ui-react';
import { Link } from 'react-router-dom';
import Card from 'react-bootstrap/Card';
import Button from 'react-bootstrap/Button';

export interface INutritionLibraryEmptyProps {
  isArchivedVisible: boolean;
}

const NutritionLibraryEmpty: React.FC<INutritionLibraryEmptyProps> = (
  { isArchivedVisible }: INutritionLibraryEmptyProps,
) => (
  <Card className="text-center">
    <Card.Body>
      <Image className="placeholder-image" src="/img/undraw_pizza_sharing.svg" size="medium" />
      <h3 className="placeholder-text">
        {isArchivedVisible
          ? 'No archived foods for you!'
          : 'You don\'t have any foods yet.'}
      </h3>
      {isArchivedVisible
        ? null
        : (
          <Button as={Link} to="/nutrition/library/new" variant="primary">
            Let&apos;s Create
            One
          </Button>
        )}
    </Card.Body>
  </Card>
);

export default NutritionLibraryEmpty;
