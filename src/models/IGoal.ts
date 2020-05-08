import {IBackendItem} from "./IBackendItem";

export default interface IGoal extends IBackendItem {
    todays_answer_value?: number;
    todays_answer?: string;
    last_answered?: string;
    frequency?: number;
    style?: string;
    start_date?: string;
    question: string;
    test: string;
}