import ICommonState from "../ICommonState";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../redux/store";
import IFood from "../../models/IFood";
import {IPaginatedResponse} from "../../models/IPaginatedReponse";
import axios from "axios";
import {API_FOODS} from "../../Backend";

interface IFoodState extends ICommonState {
    foodsById: { [foodUrl: string]: IFood };
    foodResponse: IPaginatedResponse<IFood> | null;
}

const foodsInitialState: IFoodState = {
    error: null, isLoading: false, foodsById: {}, foodResponse: null
};

const startLoading = (state: IFoodState) => {
    state.isLoading = true;
};

const loadingFailed = (state: IFoodState, action: PayloadAction<string>) => {
    state.isLoading = false;
    state.error = action.payload;
};

const singleFoodSuccess = (state: IFoodState, {payload}: PayloadAction<IFood>) => {
    state.isLoading = false;
    state.error = null;
    state.foodsById[payload.url] = payload;
};

const deletionFoodSuccess = (state: IFoodState, {payload}: PayloadAction<string>) => {
    state.isLoading = false;
    state.error = null;
    delete state.foodsById[payload];
};

const foodSlice = createSlice({
    name: 'foods', initialState: foodsInitialState, reducers: {
        getAllFoodsStart: startLoading,
        getAllFoodsSuccess: singleFoodSuccess,
        getAllFoodsFailure: loadingFailed,
        getFoodStart: startLoading,
        getFoodSuccess: singleFoodSuccess,
        getFoodFailure: loadingFailed,
        createFoodStart: startLoading,
        createFoodSuccess: singleFoodSuccess,
        createFoodFailure: loadingFailed,
        updateFoodStart: startLoading,
        updateFoodSuccess: singleFoodSuccess,
        updateFoodFailure: loadingFailed,
        deleteFoodStart: startLoading,
        deleteFoodSuccess: deletionFoodSuccess,
        deleteFoodFailure: loadingFailed,
    }
});

export const {
    getAllFoodsFailure, getAllFoodsStart, getAllFoodsSuccess,
    createFoodFailure, createFoodStart, createFoodSuccess,
    deleteFoodFailure, deleteFoodStart, deleteFoodSuccess,
    getFoodFailure, getFoodStart, getFoodSuccess,
    updateFoodFailure, updateFoodStart, updateFoodSuccess
} = foodSlice.actions;

export default foodSlice.reducer;

export const fetchAllFoods = (search?: string): AppThunk => async dispatch => {
    const params = {search};
    try {
        dispatch(getAllFoodsStart());
        const {data} = await axios.get(API_FOODS, {params: params});
        dispatch(getAllFoodsSuccess(data));
    } catch (e) {
        dispatch(getAllFoodsFailure(e.toString()));
    }
};

export const fetchFood = (foodId: number): AppThunk => async dispatch => {
    try {
        dispatch(getFoodStart());
        const {data} = await axios.get(`${API_FOODS}${foodId}/`);
        dispatch(getFoodSuccess(data));
    } catch (e) {
        dispatch(getFoodFailure(e.toString()));
    }
};

export const createFood = (food: IFood): AppThunk => async dispatch => {
    try {
        dispatch(createFoodStart());
        const {data} = await axios.post(API_FOODS, food);
        dispatch(createFoodSuccess(data));
    } catch (e) {
        dispatch(createFoodFailure(e.toString()));
    }
};

export const updateFood = (food: IFood): AppThunk => async dispatch => {
    try {
        dispatch(updateFoodStart());
        const {data} = await axios.patch(`${API_FOODS}${food.id}/`, food);
        dispatch(updateFoodSuccess(data));
    } catch (e) {
        dispatch(updateFoodFailure(e.toString()));
    }
};

export const deleteFood = (food: IFood): AppThunk => async dispatch => {
    try {
        dispatch(deleteFoodStart());
        const {data} = await axios.delete(`${API_FOODS}${food.id}/`);
        dispatch(deleteFoodSuccess(data));
    } catch (e) {
        dispatch(deleteFoodFailure(e.toString()));
    }
};