import React from 'react';
import Button from 'react-bootstrap/Button';
import ButtonGroup from 'react-bootstrap/ButtonGroup';
import { likertAnswerSet, yesNoAnswerSet } from '../../constants';

export interface IAnswerPreProps {
  goal: any;
  onAnswer: (value: number) => any;
}

const AnswerPre: React.FC<IAnswerPreProps> = ({ goal, onAnswer }: IAnswerPreProps) => {
  const pairs = goal.style === 'yesno' ? yesNoAnswerSet : likertAnswerSet;
  return (
    <ButtonGroup>
      {
        pairs.map(({ label, value }) => (
          <Button
            key={label}
            variant="secondary"
            onClick={() => onAnswer(value)}
          >
            {label}
          </Button>
        ))
      }
    </ButtonGroup>
  );
};

export default AnswerPre;
