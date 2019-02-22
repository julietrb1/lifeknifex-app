import {IFood, IFoodStoreState} from "../../reducers/foods";
import {IPaginatedResponse} from "../../backend-common";

export interface INutritionLibraryStateProps {
    foods: IFoodStoreState;
    isLoading: boolean;
    foodResponse: IPaginatedResponse<IFood>;
}