import {RouteComponentProps} from "react-router";

export interface IAnswerPostProps extends RouteComponentProps {
    goal: any;
    checkedValue: number | null;
    onAnswer: (answer: number) => any;
    isStart: boolean | null;
    isEnd: boolean | null;
    mode: 'post' | 'single';
    goBack: () => any;
}