import {RootState} from "../../redux/rootReducer";

export const selectFoodById = (state: RootState, foodId: number) => Object.values(state.foodState.foodsByUrl).find(f => f.id === foodId);
export const selectFoodsLoaded = (state: RootState) => state.foodState.foodResponse !== null;
export const selectFoodsLoading = (state: RootState) => state.foodState.isLoading;
export const selectAllFoods = (state: RootState) => Object.values(state.foodState.foodsByUrl);
export const selectFoodResponse = (state: RootState) => state.foodState.foodResponse;