import ICommonState from "../ICommonState";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../redux/store";
import IConsumption from "../../models/IConsumption";
import {IPaginatedResponse} from "../../models/IPaginatedReponse";

interface IConsumptionState extends ICommonState {
    consumptions: IConsumption[];
    consumptionResponse: IPaginatedResponse<IConsumption> | null;
}

const consumptionsInitialState: IConsumptionState = {
    error: null, isLoading: false, consumptions: [], consumptionResponse: null
};

const startLoading = (state: IConsumptionState) => {
    state.isLoading = true;
};

const loadingFailed = (state: IConsumptionState, action: PayloadAction<string>) => {
    state.isLoading = false;
    state.error = action.payload;
};

const consumptionSlice = createSlice({
    name: 'consumptions', initialState: consumptionsInitialState, reducers: {
        getConsumptionsStart: startLoading,
        getConsumptionsSuccess(state, {payload}: PayloadAction<IPaginatedResponse<IConsumption>>) {
            state.consumptionResponse = payload;
            state.error = null;
            state.isLoading = false;
        }, getConsumptionsFailure: loadingFailed,
        saveConsumption(state, {payload: consumption}: PayloadAction<IConsumption[]>) {
            // TODO: Save consumption
        }, deleteConsumption(state, {payload: consumptionToDelete}: PayloadAction<IConsumption>) {
            // TODO: Delete consumption
        }
    }
});

export const {saveConsumption, deleteConsumption, getConsumptionsFailure, getConsumptionsStart, getConsumptionsSuccess} = consumptionSlice.actions;

export default consumptionSlice.reducer;

export const fetchConsumptions = (): AppThunk => async dispatch => {
    try {
        dispatch(getConsumptionsStart());
        // TODO: Fetch consumptions
        //dispatch(getConsumptionsSuccess());
    } catch (err) {
        dispatch(getConsumptionsFailure(err.toString()));
    }
};