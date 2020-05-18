import React from 'react';
import Button from 'react-bootstrap/Button';
import Card from 'react-bootstrap/Card';
import { Link } from 'react-router-dom';
import Image from 'react-bootstrap/Image';

const NutritionHistoryNoFood = () => (
  <Card className="text-center">
    <Card.Body>
      <Image className="placeholder-image" src="/img/food.svg"/>
      <h3 className="placeholder-text">You need some food to log.</h3>
      <Button variant="primary" as={Link} to="/nutrition/library/new">New Food</Button>
    </Card.Body>
  </Card>
);

export default NutritionHistoryNoFood;
