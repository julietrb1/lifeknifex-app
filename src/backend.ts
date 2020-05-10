import axios, {AxiosError, CancelTokenSource} from 'axios';
import {API, LOCAL_STORAGE_JWT_ACCESS, LOCAL_STORAGE_JWT_REFRESH} from "./constants";
import {history} from './App';
import IConsumption from "./models/IConsumption";
import IFood from "./models/IFood";
import IGoal from "./models/IGoal";
import IAnswer from "./models/IAnswer";

const API_FEATURES = `${API}features/`;
const API_CONSUMPTIONS = `${API}consumptions/`;
const API_FOODS = `${API}foods/`;
const API_GOALS = `${API}goals/`;
const API_ANSWERS = `${API}answers/`;
const API_TOKEN = `${API}token/`;

axios.defaults.headers.common['Authorization'] = `Bearer ${getAccessToken()}`;

// for multiple requests
let isRefreshing = false;
let failedQueue: { resolve: (value: any) => void; reject: (reason?: any) => void; }[] = [];

const processQueue = (error: Error | null, token: string | null) => {
    failedQueue.forEach(prom => {
        if (error) {
            prom.reject(error);
        } else {
            prom.resolve(token);
        }
    });

    failedQueue = [];
};

axios.interceptors.response.use(function (response) {
    return response;
}, function (error: AxiosError) {
    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401 || (originalRequest as any)._retry || originalRequest.url?.endsWith('/token/')) {
        return Promise.reject(error);
    }

    if (isRefreshing) {
        return new Promise(function (resolve, reject) {
            failedQueue.push({resolve, reject});
        }).then(accessToken => {
            originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
            return axios(originalRequest);
        }).catch(err => {
            return err;
        });
    }

    (originalRequest as any)._retry = true;
    isRefreshing = true;

    const refreshToken = getRefreshToken();
    return new Promise(function (resolve, reject) {
        if (!refreshToken) {
            history.replace('/login');
            return reject('No refresh token');
        }
        axios.post(`${API_TOKEN}refresh/`, {refresh: refreshToken})
            .then(({data}) => {

                const accessToken = data.access;
                setAccessToken(accessToken);
                originalRequest.headers['Authorization'] = `Bearer ${accessToken}`;
                processQueue(null, accessToken);
                resolve(axios(originalRequest));
            })
            .catch((err) => {
                processQueue(err, null);
                history.replace('/login');
                return reject('No refresh token');
            })
            .then(() => {
                isRefreshing = false;
            });
    });
});

function getAccessToken() {
    return window.localStorage.getItem(LOCAL_STORAGE_JWT_ACCESS);
}

function setAccessToken(newAccessToken: string) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    window.localStorage.setItem(LOCAL_STORAGE_JWT_ACCESS, newAccessToken);
}

function getRefreshToken() {
    return window.localStorage.getItem(LOCAL_STORAGE_JWT_REFRESH);
}

function setRefreshToken(newRefreshToken: string) {
    window.localStorage.setItem(LOCAL_STORAGE_JWT_REFRESH, newRefreshToken);
}

function clearAccessToken() {
    window.localStorage.removeItem(LOCAL_STORAGE_JWT_ACCESS);
}

function clearRefreshToken() {
    window.localStorage.removeItem(LOCAL_STORAGE_JWT_REFRESH);
}

// FEATURES

export function getFeature(cancelToken: CancelTokenSource, featureName: string) {
    return axios.get(`${API_FEATURES}${featureName}/`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

// AUTH

export async function logIn(cancelToken: CancelTokenSource, username: string, password: string) {
    const res = await axios
        .post(`${API_TOKEN}`, {
            username: username,
            password: password
        }, {cancelToken: cancelToken.token});
    setAccessToken(res.data.access);
    setRefreshToken(res.data.refresh);
    return res.data;
}

export function register(cancelToken: CancelTokenSource, username: string, password: string) {
    // TODO: Implement this properly
    return new Promise((resolve) => resolve());
    // return axios
    //     .post(`${API_AUTH}register/`, {
    //         username: username,
    //         password: password
    //     }, {cancelToken: cancelToken.token});
}

export function getAccount(cancelToken: CancelTokenSource) {
    return axios
        .get(API, {cancelToken: cancelToken.token})
        .then(res => res.data)
        .catch(() => null);
}

export function logOut() {
    return new Promise((resolve) => {
        clearAccessToken();
        clearRefreshToken();
        resolve();
    });
}

// Consumptions
export const reqGetConsumption = (consumptionId: number) => axios.get(`${API_CONSUMPTIONS}${consumptionId}/`);
export const reqGetAllConsumptions = (search?: string) => axios.get(API_CONSUMPTIONS, {params: {search}});
export const reqCreateConsumption = (consumption: IConsumption) => axios.post(API_CONSUMPTIONS, consumption);
export const reqUpdateConsumption = (consumption: IConsumption) => axios.patch(`${API_CONSUMPTIONS}${consumption.id}/`, consumption);
export const reqDeleteConsumption = (consumption: IConsumption) => axios.delete(`${API_CONSUMPTIONS}${consumption.id}/`);

// Foods
export const reqGetFood = (foodId: number) => axios.get(`${API_FOODS}${foodId}/`);
export const reqGetAllFoods = (search?: string) => axios.get(API_FOODS, {params: {search}});
export const reqCreateFood = (food: IFood) => axios.post(API_FOODS, food);
export const reqUpdateFood = (food: IFood) => axios.patch(`${API_FOODS}${food.id}/`, food);
export const reqDeleteFood = (food: IFood) => axios.delete(`${API_FOODS}${food.id}/`);

// Goals
export const reqGetGoal = (goalId: number) => axios.get(`${API_GOALS}${goalId}/`);
export const reqGetAllGoals = (search?: string) => axios.get(API_GOALS, {params: {search}});
export const reqCreateGoal = (goal: IGoal) => axios.post(API_GOALS, goal);
export const reqUpdateGoal = (goal: IGoal) => axios.patch(`${API_GOALS}${goal.id}/`, goal);
export const reqDeleteGoal = (goal: IGoal) => axios.delete(`${API_GOALS}${goal.id}/`);

// Answers
export const reqCreateAnswer = (answer: {goal: string, value: number}) => axios.post(API_ANSWERS, answer);
export const reqUpdateAnswer = (answer: IAnswer) => axios.patch(`${API_ANSWERS}${answer.id}/`, answer);

export function getFoods(cancelToken: CancelTokenSource, search: string | null | undefined, isArchivedVisible: boolean = false) {
    const queryParams = new URLSearchParams();
    if (search && search.length) {
        queryParams.append('search', search);
    }

    queryParams.append('is_archived', String(isArchivedVisible));

    const url = `${API_FOODS}?${queryParams}`;
    return axios
        .get(url, {cancelToken: cancelToken.token})
        .then(res => res.data);
}