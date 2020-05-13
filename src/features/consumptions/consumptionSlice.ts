import ICommonState from "../ICommonState";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../redux/store";
import IConsumption from "../../models/IConsumption";
import {IPaginatedResponse} from "../../models/IPaginatedReponse";
import {
    reqCreateConsumption,
    reqDeleteConsumption,
    reqGetAllConsumptions,
    reqGetConsumption,
    reqUpdateConsumption
} from "../../backend";
import {handleStoreError} from "../../Utils";

interface IConsumptionState extends ICommonState {
    consumptionsById: { [consumptionId: number]: IConsumption | null };
    consumptionResponse: IPaginatedResponse<IConsumption> | null;
}

const consumptionsInitialState: IConsumptionState = {
    error: null, isLoading: false, consumptionsById: {}, consumptionResponse: null
};

const startLoading = (state: IConsumptionState) => {
    state.isLoading = true;
};

const loadingFailed = (state: IConsumptionState, {payload}: PayloadAction<string>) => {
    state.isLoading = false;
    state.error = payload;
};

const failureGetConsumption = (state: IConsumptionState, {payload}: PayloadAction<number>) => {
    state.isLoading = false;
    state.consumptionsById[payload] = null;
}

const singleConsumptionSuccess = (state: IConsumptionState, {payload}: PayloadAction<IConsumption>) => {
    state.isLoading = false;
    state.error = null;
    state.consumptionsById[payload.id] = payload;
};

const allConsumptionSuccess = (state: IConsumptionState, {payload}: PayloadAction<IPaginatedResponse<IConsumption>>) => {
    state.isLoading = false;
    state.error = null;
    payload.results?.forEach(c => state.consumptionsById[c.id] = c);
    state.consumptionResponse = payload;
};

const deletionConsumptionSuccess = (state: IConsumptionState, {payload}: PayloadAction<number>) => {
    state.isLoading = false;
    state.error = null;
    delete state.consumptionsById[payload];
};

const consumptionSlice = createSlice({
    name: 'consumptions', initialState: consumptionsInitialState, reducers: {
        getAllConsumptionsStart: startLoading,
        getAllConsumptionsSuccess: allConsumptionSuccess,
        getAllConsumptionsFailure: loadingFailed,
        getConsumptionStart: startLoading,
        getConsumptionSuccess: singleConsumptionSuccess,
        getConsumptionFailure: failureGetConsumption,
        createConsumptionStart: startLoading,
        createConsumptionSuccess: singleConsumptionSuccess,
        createConsumptionFailure: loadingFailed,
        updateConsumptionStart: startLoading,
        updateConsumptionSuccess: singleConsumptionSuccess,
        updateConsumptionFailure: loadingFailed,
        deleteConsumptionStart: startLoading,
        deleteConsumptionSuccess: deletionConsumptionSuccess,
        deleteConsumptionFailure: loadingFailed,
    }
});

export const {
    getAllConsumptionsFailure, getAllConsumptionsStart, getAllConsumptionsSuccess,
    createConsumptionFailure, createConsumptionStart, createConsumptionSuccess,
    deleteConsumptionFailure, deleteConsumptionStart, deleteConsumptionSuccess,
    getConsumptionFailure, getConsumptionStart, getConsumptionSuccess,
    updateConsumptionFailure, updateConsumptionStart, updateConsumptionSuccess
} = consumptionSlice.actions;

export default consumptionSlice.reducer;

export const fetchAllConsumptions = (search?: string): AppThunk => async dispatch => {
    try {
        dispatch(getAllConsumptionsStart());
        const {data} = await reqGetAllConsumptions(search);
        dispatch(getAllConsumptionsSuccess(data));
    } catch (e) {
        dispatch(getAllConsumptionsFailure(e.message));
        handleStoreError(e);
    }
};

export const fetchConsumption = (consumptionId: number): AppThunk => async dispatch => {
    try {
        dispatch(getConsumptionStart());
        const {data} = await reqGetConsumption(consumptionId);
        dispatch(getConsumptionSuccess(data));
    } catch (e) {
        dispatch(getConsumptionFailure(consumptionId));
        handleStoreError(e);
    }
};

export const createConsumption = (consumption: IConsumption): AppThunk => async dispatch => {
    try {
        dispatch(createConsumptionStart());
        const {data} = await reqCreateConsumption(consumption);
        dispatch(createConsumptionSuccess(data));
        return data;
    } catch (e) {
        dispatch(createConsumptionFailure(e.message)); // TODO: Consider scope of failure logic
        handleStoreError(e);
    }
};

export const updateConsumption = (consumption: IConsumption): AppThunk => async dispatch => {
    try {
        dispatch(updateConsumptionStart());
        const {data} = await reqUpdateConsumption(consumption);
        dispatch(updateConsumptionSuccess(data));
    } catch (e) {
        handleStoreError(e);
    }
};

export const deleteConsumption = (consumption: IConsumption): AppThunk => async dispatch => {
    try {
        dispatch(deleteConsumptionStart());
        const {data} = await reqDeleteConsumption(consumption);
        dispatch(deleteConsumptionSuccess(data.id));
    } catch (e) {
        handleStoreError(e);
    }
};