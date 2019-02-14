import axios from 'axios';
import {foodsFetchDataSuccess, foodsHasErrored, foodsIsLoading} from "./actions/foods";
import {API, LOCAL_STORAGE_JWT_ACCESS, LOCAL_STORAGE_JWT_REFRESH} from "./constants";

const API_FEATURES = `${API}features/`;
const API_CONSUMPTIONS = `${API}consumptions/`;
export const API_FOODS = `${API}foods/`;
const API_GOALS = `${API}goals/`;
const API_TOKEN = `${API}token/`;

export const instance = axios.create({baseURL: API});
instance.interceptors.request.use(config => ensureLoggedIn(config),
    console.error);

function refreshLogin(refreshToken) {
    return axios.post(`${API_TOKEN}/refresh/`)
        .send({refresh: refreshToken})
        .then(res => {

            let accessToken = res.body.access;
            if (res.statusCode === 200 && accessToken) {
                window.localStorage.setItem(LOCAL_STORAGE_JWT_ACCESS, accessToken);
                return accessToken;
            } else {
                throw new Error(`Failed to refresh access token - status was ${res.statusCode}`);
            }
        });
}

export function ensureLoggedIn(config) {
    const accessToken = window.localStorage.getItem(LOCAL_STORAGE_JWT_ACCESS);
    const refreshToken = window.localStorage.getItem(LOCAL_STORAGE_JWT_REFRESH);
    if (!accessToken && !refreshToken) {
        return Promise.reject('Not logged in');
    }

    if (config) {
        config.headers['Authorization'] = `Bearer ${accessToken}`;
        return Promise.resolve(config);
    } else {
        return Promise.resolve();
    }

    // TODO: Investigate axios not being defined
    // if (accessToken) {
    //     axios.post(`${API_TOKEN}/verify/`)
    //         .send({token: accessToken})
    //         .then(res => {
    //             if (res.statusCode === 200) {
    //                 originalRequest['Authorization'] = accessToken;
    //                 return Promise.resolve(originalRequest);
    //             } else if (res.statusCode === 401 && refreshToken) {
    //                 refreshLogin(refreshToken)
    //                     .then(() => {
    //                         originalRequest.headers['Authorization'] =
    //                             `Bearer ${window.localStorage.getItem(LOCAL_STORAGE_JWT_ACCESS)}`;
    //                         return Promise.resolve(originalRequest);
    //                     })
    //                     .catch(Promise.reject);
    //             } else {
    //                 return Promise.reject('Not logged in');
    //             }
    //         });
    // } else {
    //     refreshLogin(refreshToken)
    //         .then(() => {
    //             originalRequest['Authorization'] =
    //                 `Bearer ${window.localStorage.getItem(LOCAL_STORAGE_JWT_ACCESS)}`;
    //             return Promise.resolve(originalRequest);
    //         })
    //         .catch(Promise.reject);
    // }
}

export function getGoals() {
    return dispatch => {
        dispatch(foodsIsLoading(true));
        instance.get(API_FOODS)
            .then(response => {
                dispatch(foodsIsLoading(false));
                return response;
            })
            .then(response => response.data)
            .then(foods => dispatch(foodsFetchDataSuccess(foods)))
            .catch(() => dispatch(foodsHasErrored(true)));
    };
}

export function updateGoal(cancelToken, goal) {
    return instance.put(`API_GOALS/${goal.id}`, goal, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getGoal(cancelToken, goalId) {
    return instance.get(`API_GOALS/${goalId}`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createGoal(cancelToken, goal) {
    return instance.post(API_GOALS, goal, {cancelToken: cancelToken.token})
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
            window.localStorage.setItem(LOCAL_STORAGE_JWT_ACCESS, res.data.access);
            window.localStorage.setItem(LOCAL_STORAGE_JWT_REFRESH, res.data.refresh);
            return res.data;
        });
}

export function register(cancelToken, username, password) {
    // return instance
    //     .post(`${API_AUTH}register/`, {
    //         username: username,
    //         password: password
    //     }, {cancelToken: cancelToken.token});
}

export function getAccount(cancelToken) {
    return instance
        .get(API, {cancelToken: cancelToken.token})
        .then(res => res.data)
        .catch(() => null);
}

export function logOut() {
    return new Promise((resolve) => {
        window.localStorage.removeItem(LOCAL_STORAGE_JWT_ACCESS);
        window.localStorage.removeItem(LOCAL_STORAGE_JWT_REFRESH);
        resolve();
    });
}

export function getConsumptions(cancelToken) {
    return instance
        .get(API_CONSUMPTIONS, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getConsumption(cancelToken, consumptionId) {
    return instance
        .get(`${API_CONSUMPTIONS}${consumptionId}/`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createConsumption(cancelToken, consumption) {
    return instance
        .post(API_CONSUMPTIONS, consumption, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function updateConsumption(cancelToken, consumption) {
    return instance
        .put(`${API_CONSUMPTIONS}${consumption.id}/`, consumption, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function deleteConsumption(cancelToken, consumptionId) {
    return instance
        .delete(`${API_CONSUMPTIONS}${consumptionId}/`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getFood(cancelToken, foodId) {
    return instance
        .get(`${API_FOODS}${foodId}/`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function updateFood(cancelToken, food) {
    return instance
        .patch(`${API_FOODS}${food.id}/`, food, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createFood(cancelToken, food) {
    return instance
        .post(API_FOODS, food, {cancelToken: cancelToken.token})
        .then(res => res.data);
}
