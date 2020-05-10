import ICommonState from "../ICommonState";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../redux/store";
import IConsumption from "../../models/IConsumption";
import {IPaginatedResponse} from "../../models/IPaginatedReponse";
import axios from "axios";
import {API_CONSUMPTIONS} from "../../Backend";

interface IConsumptionState extends ICommonState {
    consumptionsById: { [consumptionUrl: string]: IConsumption };
    consumptionResponse: IPaginatedResponse<IConsumption> | null;
}

const consumptionsInitialState: IConsumptionState = {
    error: null, isLoading: false, consumptionsById: {}, consumptionResponse: null
};

const startLoading = (state: IConsumptionState) => {
    state.isLoading = true;
};

const loadingFailed = (state: IConsumptionState, action: PayloadAction<string>) => {
    state.isLoading = false;
    state.error = action.payload;
};

const singleConsumptionSuccess = (state: IConsumptionState, {payload}: PayloadAction<IConsumption>) => {
    state.isLoading = false;
    state.error = null;
    state.consumptionsById[payload.url] = payload;
};

const allConsumptionSuccess = (state: IConsumptionState, {payload}: PayloadAction<IPaginatedResponse<IConsumption>>) => {
    state.isLoading = false;
    state.error = null;
    payload.results?.forEach(c => state.consumptionsById[c.url] = c);
    state.consumptionResponse = payload;
};

const deletionConsumptionSuccess = (state: IConsumptionState, {payload}: PayloadAction<string>) => {
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
        getConsumptionFailure: loadingFailed,
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
    const params = {search};
    try {
        dispatch(getAllConsumptionsStart());
        const {data} = await axios.get(API_CONSUMPTIONS, {params: params});
        dispatch(getAllConsumptionsSuccess(data));
    } catch (e) {
        dispatch(getAllConsumptionsFailure(e.toString()));
    }
};

export const fetchConsumption = (consumptionId: number): AppThunk => async dispatch => {
    try {
        dispatch(getConsumptionStart());
        const {data} = await axios.get(`${API_CONSUMPTIONS}${consumptionId}/`);
        dispatch(getConsumptionSuccess(data));
    } catch (e) {
        dispatch(getConsumptionFailure(e.toString()));
    }
};

export const createConsumption = (consumption: IConsumption): AppThunk => async dispatch => {
    try {
        dispatch(createConsumptionStart());
        const {data} = await axios.post(API_CONSUMPTIONS, consumption);
        dispatch(createConsumptionSuccess(data));
    } catch (e) {
        dispatch(createConsumptionFailure(e.toString()));
    }
};

export const updateConsumption = (consumption: IConsumption): AppThunk => async dispatch => {
    try {
        dispatch(updateConsumptionStart());
        const {data} = await axios.patch(`${API_CONSUMPTIONS}${consumption.id}/`, consumption);
        dispatch(updateConsumptionSuccess(data));
    } catch (e) {
        dispatch(updateConsumptionFailure(e.toString()));
    }
};

export const deleteConsumption = (consumption: IConsumption): AppThunk => async dispatch => {
    try {
        dispatch(deleteConsumptionStart());
        const {data} = await axios.delete(`${API_CONSUMPTIONS}${consumption.id}/`);
        dispatch(deleteConsumptionSuccess(data));
    } catch (e) {
        dispatch(deleteConsumptionFailure(e.toString()));
    }
};