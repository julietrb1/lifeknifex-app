import {RootState} from "../../redux/rootReducer";

export const selectFoodById = (state: RootState, foodId: number) => state.foodState.foodsById[foodId];
export const selectFoodsLoaded = (state: RootState) => !!state.foodState.foodResponse;
export const selectFoodsLoading = (state: RootState) => state.foodState.isLoading;
export const selectAllFoods = (state: RootState, isArchived: boolean | null = null) => Object.values(state.foodState.foodsById).filter(f => isArchived === null || f.is_archived === isArchived);
export const selectFoodResponse = (state: RootState) => state.foodState.foodResponse;
export const selectFoodCount = (state: RootState) => state.foodState.foodResponse?.count || 0;