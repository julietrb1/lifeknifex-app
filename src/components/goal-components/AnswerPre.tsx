import React from 'react';
import { Form } from 'semantic-ui-react';
import { COLOR_GOALS, likertAnswerSet, yesNoAnswerSet, } from '../../constants';

export interface IAnswerPreProps {
  goal: any;
  onAnswer: (value: number) => any;
}

const AnswerPre: React.FC<IAnswerPreProps> = ({ goal, onAnswer }: IAnswerPreProps) => {
  const pairs = goal.style === 'yesno' ? yesNoAnswerSet : likertAnswerSet;
  return (
    <div>
      {
        pairs.map(({ label, value }) => (
          <Form.Button
            key={label}
            fluid
            basic
            color={COLOR_GOALS}
            onClick={() => onAnswer(value)}
          >
            {label}
          </Form.Button>
        ))
      }
    </div>
  );
};

export default AnswerPre;
