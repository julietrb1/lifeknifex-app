import axios from 'axios';
import {API, LOCAL_STORAGE_JWT_ACCESS, LOCAL_STORAGE_JWT_REFRESH} from "./constants";
import {history} from './App';

const API_FEATURES = `${API}features/`;
const API_CONSUMPTIONS = `${API}consumptions/`;
export const API_FOODS = `${API}foods/`;
export const API_GOALS = `${API}goals/`;
export const API_ANSWERS = `${API}answers/`;
export const API_TOKEN = `${API}token/`;

axios.defaults.headers.common['Authorization'] = `Bearer ${getAccessToken()}`;

// for multiple requests
let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
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
}, function (error) {

    const originalRequest = error.config;

    if (!error.response || error.response.status !== 401 || originalRequest._retry) {
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

    originalRequest._retry = true;
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

function setAccessToken(newAccessToken) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${newAccessToken}`;
    window.localStorage.setItem(LOCAL_STORAGE_JWT_ACCESS, newAccessToken);
}

function getRefreshToken() {
    return window.localStorage.getItem(LOCAL_STORAGE_JWT_REFRESH);
}

function setRefreshToken(newRefreshToken) {
    window.localStorage.setItem(LOCAL_STORAGE_JWT_REFRESH, newRefreshToken);
}

function clearAccessToken() {
    window.localStorage.removeItem(LOCAL_STORAGE_JWT_ACCESS);
}

function clearRefreshToken() {
    window.localStorage.removeItem(LOCAL_STORAGE_JWT_REFRESH);
}

// GOALS

export function updateGoal(cancelToken, goal) {
    return axios.put(`${API_GOALS}${goal.id}/`, goal, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getGoal(cancelToken, goalId) {
    return axios.get(`${API_GOALS}${goalId}/`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createGoal(cancelToken, goal) {
    return axios.post(API_GOALS, goal, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

// ANSWERS

export function createAnswer(cancelToken, answer) {
    return axios.post(`${API_ANSWERS}`, answer, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getFeature(cancelToken, featureName) {
    return axios.get(`${API_FEATURES}${featureName}/`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function logIn(cancelToken, username, password) {
    return axios
        .post(`${API_TOKEN}`, {
            username: username,
            password: password
        }, {cancelToken: cancelToken.token})
        .then(res => {
            setAccessToken(res.data.access);
            setRefreshToken(res.data.refresh);
            return res.data;
        });
}

export function register(cancelToken, username, password) {
    // return axios
    //     .post(`${API_AUTH}register/`, {
    //         username: username,
    //         password: password
    //     }, {cancelToken: cancelToken.token});
}

export function getAccount(cancelToken) {
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

export function getConsumptions(cancelToken) {
    return axios
        .get(API_CONSUMPTIONS, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getConsumption(cancelToken, consumptionId) {
    return axios
        .get(`${API_CONSUMPTIONS}${consumptionId}/`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createConsumption(cancelToken, consumption) {
    return axios
        .post(API_CONSUMPTIONS, consumption, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function updateConsumption(cancelToken, consumption) {
    return axios
        .put(`${API_CONSUMPTIONS}${consumption.id}/`, consumption, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function deleteConsumption(cancelToken, consumptionId) {
    return axios
        .delete(`${API_CONSUMPTIONS}${consumptionId}/`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getFoods(cancelToken, search, isArchivedVisible) {
    const queryParams = new URLSearchParams();
    if (search && search.length) {
        queryParams.append('search', search);
    }

    queryParams.append('is_archived', isArchivedVisible);

    const url = `${API_FOODS}?${queryParams}`;
    return axios
        .get(url, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getFood(cancelToken, foodId) {
    return axios
        .get(`${API_FOODS}${foodId}/`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function updateFood(cancelToken, food) {
    return axios
        .patch(`${API_FOODS}${food.id}/`, food, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createFood(cancelToken, food) {
    return axios
        .post(API_FOODS, food, {cancelToken: cancelToken.token})
        .then(res => res.data);
}
