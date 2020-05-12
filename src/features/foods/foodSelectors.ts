import {RootState} from "../../redux/rootReducer";

export const selectFoodById = (state: RootState, foodId: number) => Object.values(state.foodState.foodsByUrl).find(f => f.id === foodId);
export const selectFoodsLoaded = (state: RootState) => !!state.foodState.foodResponse;
export const selectFoodsLoading = (state: RootState) => state.foodState.isLoading;
export const selectAllFoods = (state: RootState, isArchived: boolean | null = null) => Object.values(state.foodState.foodsByUrl).filter(f => isArchived === null || f.is_archived === isArchived);
export const selectFoodResponse = (state: RootState) => state.foodState.foodResponse;
export const selectFoodCount = (state: RootState) => state.foodState.foodResponse?.count || 0;