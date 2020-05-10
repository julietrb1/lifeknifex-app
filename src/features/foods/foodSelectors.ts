import {RootState} from "../../redux/rootReducer";

export const selectFoodById = (state: RootState, foodId: number) => state.foodState.foodsById[foodId];
export const selectFoodsLoaded = (state: RootState) => state.foodState.foodResponse !== null;
export const selectFoodsLoading = (state: RootState) => state.foodState.isLoading;
export const selectAllFoods = (state: RootState) => Object.values(state.foodState.foodsById);
export const selectFoodResponse = (state: RootState) => state.foodState.foodResponse;