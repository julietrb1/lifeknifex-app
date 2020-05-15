/* eslint-disable no-param-reassign */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';
import ICommonState from '../ICommonState';
// eslint-disable-next-line import/no-cycle
import { AppThunk } from '../../redux/store';
import IFood from '../../models/IFood';
import { IPaginatedResponse } from '../../models/IPaginatedReponse';
import {
  reqCreateFood,
  reqDeleteFood,
  reqGetAllFoods,
  reqGetFood,
  reqUpdateFood,
} from '../../backend';
import { extractStoreError } from '../../Utils';

interface IFoodState extends ICommonState {
  foodsById: { [foodUrl: number]: IFood };
  foodResponse: IPaginatedResponse<IFood> | null;
}

const foodsInitialState: IFoodState = {
  error: null, isLoading: false, foodsById: {}, foodResponse: null,
};

const startLoading = (state: IFoodState) => {
  state.isLoading = true;
};

const loadingFailed = (state: IFoodState, action: PayloadAction<string>) => {
  state.isLoading = false;
  state.error = action.payload;
};

const singleFoodSuccess = (state: IFoodState, { payload }: PayloadAction<IFood>) => {
  state.isLoading = false;
  state.error = null;
  state.foodsById[payload.id] = payload;
};

const allFoodsSuccess = (
  state: IFoodState, { payload }: PayloadAction<IPaginatedResponse<IFood>>,
) => {
  state.isLoading = false;
  state.error = null;
  (payload.results || []).forEach((c) => {
    state.foodsById[c.id] = c;
  });
  state.foodResponse = payload;
};

const deletionFoodSuccess = (state: IFoodState, { payload }: PayloadAction<number>) => {
  state.isLoading = false;
  state.error = null;
  delete state.foodsById[payload];
};

const creationFoodSuccess = (state: IFoodState, action: PayloadAction<IFood>) => {
  singleFoodSuccess(state, action);
  if (typeof state.foodResponse?.count === 'number') state.foodResponse.count += 1;
};

const foodSlice = createSlice({
  name: 'foods',
  initialState: foodsInitialState,
  reducers: {
    getAllFoodsStart: startLoading,
    getAllFoodsSuccess: allFoodsSuccess,
    getAllFoodsFailure: loadingFailed,
    getFoodStart: startLoading,
    getFoodSuccess: singleFoodSuccess,
    getFoodFailure: loadingFailed,
    createFoodStart: startLoading,
    createFoodSuccess: creationFoodSuccess,
    createFoodFailure: loadingFailed,
    updateFoodStart: startLoading,
    updateFoodSuccess: singleFoodSuccess,
    updateFoodFailure: loadingFailed,
    deleteFoodStart: startLoading,
    deleteFoodSuccess: deletionFoodSuccess,
    deleteFoodFailure: loadingFailed,
  },
});

export const {
  getAllFoodsFailure, getAllFoodsStart, getAllFoodsSuccess,
  createFoodFailure, createFoodStart, createFoodSuccess,
  deleteFoodFailure, deleteFoodStart, deleteFoodSuccess,
  getFoodFailure, getFoodStart, getFoodSuccess,
  updateFoodFailure, updateFoodStart, updateFoodSuccess,
} = foodSlice.actions;

export default foodSlice.reducer;

export const fetchAllFoods = (search?: string): AppThunk => async (dispatch) => {
  try {
    dispatch(getAllFoodsStart());
    const response = await reqGetAllFoods(search);
    dispatch(getAllFoodsSuccess(response.data));
    return response.data;
  } catch (e) {
    dispatch(getAllFoodsFailure(e.message));
    throw Error(extractStoreError(e));
  }
};

export const fetchFood = (foodId: number): AppThunk => async (dispatch) => {
  try {
    dispatch(getFoodStart());
    const { data } = await reqGetFood(foodId);
    dispatch(getFoodSuccess(data));
    return data;
  } catch (e) {
    dispatch(getFoodFailure(e.message));
    throw Error(extractStoreError(e));
  }
};

export const createFood = (food: IFood): AppThunk => async (dispatch) => {
  try {
    dispatch(createFoodStart());
    const { data } = await reqCreateFood(food);
    dispatch(createFoodSuccess(data));
    return data;
  } catch (e) {
    dispatch(createFoodFailure(e.message));
    throw Error(extractStoreError(e));
  }
};

export const updateFood = (food: IFood): AppThunk => async (dispatch) => {
  try {
    dispatch(updateFoodStart());
    const { data } = await reqUpdateFood(food);
    dispatch(updateFoodSuccess(data));
    return data;
  } catch (e) {
    dispatch(updateFoodFailure(e.message));
    throw Error(extractStoreError(e));
  }
};

export const deleteFood = (food: IFood): AppThunk => async (dispatch) => {
  try {
    dispatch(deleteFoodStart());
    const { data } = await reqDeleteFood(food);
    dispatch(deleteFoodSuccess(data));
  } catch (e) {
    dispatch(deleteFoodFailure(e.message));
    throw Error(extractStoreError(e));
  }
};
