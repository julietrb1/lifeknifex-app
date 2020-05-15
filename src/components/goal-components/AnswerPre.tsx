import React from 'react';
import { Form } from 'semantic-ui-react';
import { COLOR_GOALS } from '../../constants';

export interface IAnswerPreProps {
  goal: any;
  onAnswer: (value: number) => any;
}

const AnswerPre: React.FC<IAnswerPreProps> = ({ goal, onAnswer }: IAnswerPreProps) => {
  if (goal.style === 'yesno') {
    return (
      <div>
        <Form.Button fluid basic color={COLOR_GOALS} onClick={() => onAnswer(1)}>Yes</Form.Button>
        <Form.Button fluid basic color={COLOR_GOALS} onClick={() => onAnswer(2)}>No</Form.Button>
      </div>
    );
  }
  return (
    <div>
      <Form.Button
        fluid
        basic
        color={COLOR_GOALS}
        onClick={() => onAnswer(1)}
      >
        Effectively
      </Form.Button>
      <Form.Button
        fluid
        basic
        color={COLOR_GOALS}
        onClick={() => onAnswer(2)}
      >
        Adequately
      </Form.Button>
      <Form.Button
        fluid
        basic
        color={COLOR_GOALS}
        onClick={() => onAnswer(3)}
      >
        Poorly
      </Form.Button>
      <Form.Button
        fluid
        basic
        color={COLOR_GOALS}
        onClick={() => onAnswer(4)}
      >
        Unsuccessfully
      </Form.Button>
    </div>
  );
};

export default AnswerPre;
