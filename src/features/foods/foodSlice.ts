import ICommonState from "../ICommonState";
import {createSlice, PayloadAction} from "@reduxjs/toolkit";
import {AppThunk} from "../../redux/store";
import IFood from "../../models/IFood";
import {IPaginatedResponse} from "../../models/IPaginatedReponse";

interface IFoodState extends ICommonState {
    foods: IFood[];
    foodResponse: IPaginatedResponse<IFood> | null;
}

const foodsInitialState: IFoodState = {
    error: null, isLoading: false, foods: [], foodResponse: null
};

const startLoading = (state: IFoodState) => {
    state.isLoading = true;
};

const loadingFailed = (state: IFoodState, action: PayloadAction<string>) => {
    state.isLoading = false;
    state.error = action.payload;
};

const foodSlice = createSlice({
    name: 'foods', initialState: foodsInitialState, reducers: {
        getFoodsStart: startLoading,
        getFoodsSuccess(state, {payload}: PayloadAction<IPaginatedResponse<IFood>>) {
            state.foodResponse = payload;
            state.error = null;
            state.isLoading = false;
        }, getFoodsFailure: loadingFailed,
        saveFood(state, {payload: food}: PayloadAction<IFood[]>) {
            // TODO: Save food
        }, deleteFood(state, {payload: foodToDelete}: PayloadAction<IFood>) {
            // TODO: Delete food
        }
    }
});

export const {saveFood, deleteFood, getFoodsFailure, getFoodsStart, getFoodsSuccess} = foodSlice.actions;

export default foodSlice.reducer;

export const fetchFoods = (): AppThunk => async dispatch => {
    try {
        dispatch(getFoodsStart());
        // TODO: Fetch foods
        //dispatch(getFoodsSuccess());
    } catch (err) {
        dispatch(getFoodsFailure(err.toString()));
    }
};