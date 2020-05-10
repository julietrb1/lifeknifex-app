import {RootState} from "../../redux/rootReducer";

export const selectConsumptionById = (state: RootState, consumptionId: number) => state.consumptionState.consumptionsById[consumptionId];
export const selectConsumptionLoadedById = (state: RootState, consumptionId: number) => consumptionId in Object.keys(state.consumptionState.consumptionsById);
export const selectConsumptionsLoaded = (state: RootState) => state.consumptionState.consumptionResponse !== null;
export const selectConsumptionsLoading = (state: RootState) => state.consumptionState.isLoading;
export const selectAllConsumptions = (state: RootState) => Object.values(state.consumptionState.consumptionsById);
export const selectConsumptionResponse = (state: RootState) => state.consumptionState.consumptionResponse;