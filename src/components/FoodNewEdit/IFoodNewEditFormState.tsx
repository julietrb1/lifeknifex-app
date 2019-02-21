import {IFood} from "../../reducers/foods";

export interface IFoodNewEditFormState {
    isLoading: boolean;
    food: IFood;
    submissionError: string;
    isArchiveVisible: boolean;
    isUnarchiveVisible: boolean;
}