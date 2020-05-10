import axios, {AxiosError, CancelTokenSource} from 'axios';
import {API, LOCAL_STORAGE_JWT_ACCESS, LOCAL_STORAGE_JWT_REFRESH} from "./constants";
import {history} from './App';

const API_FEATURES = `${API}features/`;
export const API_CONSUMPTIONS = `${API}consumptions/`;
export const API_FOODS = `${API}foods/`;
export const API_GOALS = `${API}goals/`;
export const API_ANSWERS = `${API}answers/`;
export const API_TOKEN = `${API}token/`;

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

export function getConsumption(cancelToken: CancelTokenSource, consumptionId: number) {
    return axios
        .get(`${API_CONSUMPTIONS}${consumptionId}/`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createConsumption(cancelToken: CancelTokenSource, consumption: any) {
    return axios
        .post(API_CONSUMPTIONS, consumption, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function updateConsumption(cancelToken: CancelTokenSource, consumption: any) {
    return axios
        .put(`${API_CONSUMPTIONS}${consumption.id}/`, consumption, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function deleteConsumption(cancelToken: CancelTokenSource, consumptionId: number) {
    return axios
        .delete(`${API_CONSUMPTIONS}${consumptionId}/`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

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

export function getFood(cancelToken: CancelTokenSource, foodId: number) {
    return axios
        .get(`${API_FOODS}${foodId}/`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createFood(cancelToken: CancelTokenSource, food: any) {
    return axios
        .post(API_FOODS, food, {cancelToken: cancelToken.token})
        .then(res => res.data);
}
