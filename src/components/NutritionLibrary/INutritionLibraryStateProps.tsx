import {IFood, IFoodStoreState} from "../../reducers/foods";
import {IPaginatedResponse} from "../../models/IPaginatedReponse";

export interface INutritionLibraryStateProps {
    foods: IFoodStoreState;
    isLoading: boolean;
    foodResponse: IPaginatedResponse<IFood>;
}