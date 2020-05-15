import axios, { CancelTokenSource } from 'axios';
import { XSRF_COOKIE_NAME, XSRF_HEADER_NAME } from './constants';
import IConsumption from './models/IConsumption';
import IFood from './models/IFood';
import IGoal from './models/IGoal';
import { IPaginatedResponse } from './models/IPaginatedReponse';
import IAnswer from './models/IAnswer';
import IAccount from './models/IAccount';

let API = 'http://localhost:8000/';
const ciUrl = process.env.REACT_APP_BACKEND_URL;
const prodUrl = process.env.REACT_APP_BACKEND_URL_PROD;
if (prodUrl && document.location.hostname === 'lifeknifex.com') API = prodUrl;
if (ciUrl && document.location.hostname === 'lifeknifex-app.herokuapp.com') API = ciUrl;

const API_FEATURES = `${API}features/`;
const API_CONSUMPTIONS = `${API}consumptions/`;
const API_FOODS = `${API}foods/`;
const API_GOALS = `${API}goals/`;
const API_ANSWERS = `${API}answers/`;
const API_ACCOUNT = `${API}account/`;
const API_AUTH_LOGIN = `${API_ACCOUNT}login/`;
const API_AUTH_LOGOUT = `${API}api-auth/logout/`;

axios.defaults.xsrfCookieName = XSRF_COOKIE_NAME;
axios.defaults.xsrfHeaderName = XSRF_HEADER_NAME;
axios.defaults.withCredentials = true;

// FEATURES

export function getFeature(cancelToken: CancelTokenSource, featureName: string) {
  return axios.get(`${API_FEATURES}${featureName}/`, { cancelToken: cancelToken.token })
    .then((res) => res.data);
}

// Base
export const reqGetBase = () => axios.get(API);

// Consumptions
export const reqGetConsumption = (consumptionId: number) => axios.get<IConsumption>(`${API_CONSUMPTIONS}${consumptionId}/`);
export const reqGetAllConsumptions = (
  search?: string,
) => axios.get<IPaginatedResponse<IConsumption>>(API_CONSUMPTIONS, { params: { search } });
export const reqCreateConsumption = (
  consumption: IConsumption,
) => axios.post<IConsumption>(API_CONSUMPTIONS, consumption);
export const reqUpdateConsumption = (consumption: IConsumption) => axios.patch<IConsumption>(`${API_CONSUMPTIONS}${consumption.id}/`, consumption);
export const reqDeleteConsumption = (consumption: IConsumption) => axios.delete(`${API_CONSUMPTIONS}${consumption.id}/`);

// Foods
export const reqGetFood = (foodId: number) => axios.get<IFood>(`${API_FOODS}${foodId}/`);
export const reqGetAllFoods = (
  search?: string,
) => axios.get<IPaginatedResponse<IFood>>(API_FOODS, { params: { search } });
export const reqCreateFood = (food: IFood) => axios.post<IFood>(API_FOODS, food);
export const reqUpdateFood = (food: IFood) => axios.patch<IFood>(`${API_FOODS}${food.id}/`, food);
export const reqDeleteFood = (food: IFood) => axios.delete(`${API_FOODS}${food.id}/`);

// Goals
export const reqGetGoal = (goalId: number) => axios.get<IGoal>(`${API_GOALS}${goalId}/`);
export const reqGetAllGoals = (
  search?: string,
) => axios.get<IPaginatedResponse<IGoal>>(API_GOALS, { params: { search } });
export const reqCreateGoal = (goal: IGoal) => axios.post<IGoal>(API_GOALS, goal);
export const reqUpdateGoal = (goal: IGoal) => axios.patch<IGoal>(`${API_GOALS}${goal.id}/`, goal);
export const reqDeleteGoal = (goal: IGoal) => axios.delete(`${API_GOALS}${goal.id}/`);

// Answers
export const reqCreateAnswer = (goal: IGoal, value: number) => axios.post<IAnswer>(API_ANSWERS, {
  goal: goal.url,
  value,
});
export const reqUpdateAnswer = (
  goal: IGoal, value: number,
) => axios.patch<IAnswer>(String(goal.todays_answer), { value });

// Account
export const reqLogIn = (username: string, password: string) => axios
  .get<IAccount>(`${API_AUTH_LOGIN}`, { auth: { username, password } });
export const reqLogOut = () => axios
  .get(`${API_AUTH_LOGOUT}`);
export const reqGetAccount = () => axios.get<IAccount>(API_ACCOUNT);
