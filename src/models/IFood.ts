import { IBackendItem } from './IBackendItem';

export default interface IFood extends IBackendItem {
  name: string;
  health_index: number;
  is_archived: boolean;
  icon: string;
}
