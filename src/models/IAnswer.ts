import { IBackendItem } from './IBackendItem';

export default interface IAnswer extends IBackendItem {
  goal: string;
  value: number;
  date: string;
}
