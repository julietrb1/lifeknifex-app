import axios, {AxiosError, CancelTokenSource} from 'axios';
import {LOCAL_STORAGE_JWT_ACCESS, LOCAL_STORAGE_JWT_REFRESH} from "./constants";
import {history} from './App';
import IConsumption from "./models/IConsumption";
import IFood from "./models/IFood";
import IGoal from "./models/IGoal";
import {extractError} from "./Utils";
import {IPaginatedResponse} from "./models/IPaginatedReponse";
import IAnswer from "./models/IAnswer";

let API = 'http://localhost:8000/';
if (document.location.hostname === 'app.lifeknifex.com') {
    const prodUrl = process.env.REACT_APP_BACKEND_URL_PROD;
    if (!prodUrl) throw Error('In production with no REACT_APP_BACKEND_URL_PROD environment variable');
    API = prodUrl;
}

if (document.location.hostname === 'lifeknifex-app.herokuapp.com') {
    const ciUrl = process.env.REACT_APP_BACKEND_URL;
    if (!ciUrl) throw Error('In CI with no REACT_APP_BACKEND_URL_PROD environment variable');
    API = ciUrl;
}

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

const handleReq = async (requestFunc: () => any) => {
    try {
        return await requestFunc();
    } catch (e) {
        throw Error(extractError(e));
    }
};

// Base
export const reqGetBase = () => axios.get(API);

// Consumptions
export const reqGetConsumption = (consumptionId: number) => axios.get<IConsumption>(`${API_CONSUMPTIONS}${consumptionId}/`);
export const reqGetAllConsumptions = (search?: string) => axios.get<IPaginatedResponse<IConsumption>>(API_CONSUMPTIONS, {params: {search}});
export const reqCreateConsumption = (consumption: IConsumption) => handleReq(() => axios.post<IConsumption>(API_CONSUMPTIONS, consumption));
export const reqUpdateConsumption = (consumption: IConsumption) => axios.patch<IConsumption>(`${API_CONSUMPTIONS}${consumption.id}/`, consumption);
export const reqDeleteConsumption = (consumption: IConsumption) => axios.delete(`${API_CONSUMPTIONS}${consumption.id}/`);

// Foods
export const reqGetFood = (foodId: number) => axios.get<IFood>(`${API_FOODS}${foodId}/`);
export const reqGetAllFoods = (search?: string) => axios.get<IPaginatedResponse<IFood>>(API_FOODS, {params: {search}});
export const reqCreateFood = (food: IFood) => axios.post<IFood>(API_FOODS, food);
export const reqUpdateFood = (food: IFood) => axios.patch<IFood>(`${API_FOODS}${food.id}/`, food);
export const reqDeleteFood = (food: IFood) => axios.delete(`${API_FOODS}${food.id}/`);

// Goals
export const reqGetGoal = (goalId: number) => axios.get<IGoal>(`${API_GOALS}${goalId}/`);
export const reqGetAllGoals = (search?: string) => axios.get<IPaginatedResponse<IGoal>>(API_GOALS, {params: {search}});
export const reqCreateGoal = (goal: IGoal) => axios.post<IGoal>(API_GOALS, goal);
export const reqUpdateGoal = (goal: IGoal) => axios.patch<IGoal>(`${API_GOALS}${goal.id}/`, goal);
export const reqDeleteGoal = (goal: IGoal) => axios.delete(`${API_GOALS}${goal.id}/`);

// Answers
export const reqCreateAnswer = (goal: IGoal, value: number) => axios.post<IAnswer>(API_ANSWERS, {
    goal: goal.url,
    value
});
export const reqUpdateAnswer = (goal: IGoal, value: number) => axios.patch<IAnswer>(String(goal.todays_answer), {value});