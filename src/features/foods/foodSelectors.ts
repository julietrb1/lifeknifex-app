import {RootState} from "../../redux/rootReducer";

export const selectFoodById = (state: RootState, foodId: number) => state.foodState.foods.find(f => f.id === foodId);