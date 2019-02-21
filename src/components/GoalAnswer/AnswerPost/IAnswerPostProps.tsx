import {RouteComponentProps} from "react-router";

export interface IAnswerPostProps extends RouteComponentProps {
    goal: any;
    checkedValue: number;
    onAnswer: (answer: number) => any;
    isStart: boolean;
    isEnd: boolean;
    mode: 'post' | 'single';
    goBack: () => any;
}