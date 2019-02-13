import axios from 'axios';
import {foodsFetchDataSuccess, foodsHasErrored, foodsIsLoading} from "./actions/foods";

axios.defaults.withCredentials = true;

let backendUrl = '';
switch (document.location.hostname) {
    case 'app.lifeknifex.com':
        backendUrl = process.env.REACT_APP_BACKEND_URL_PROD;
        break;
    case 'lifeknifex-app.herokuapp.com':
        backendUrl = process.env.REACT_APP_BACKEND_URL;
        break;
    default:
        backendUrl = 'http://localhost:3000';
        break;
}

const API = `${backendUrl}/api/v1`;
const API_FEATURES = `${API}/features`;
const API_AUTH = `${API}/auth`;
const API_CONSUMPTIONS = `${API}/consumptions`;
const API_FOODS = `${API}/foods`;
const API_GOALS = `${API}/goals`;

export function getGoals() {
    return dispatch => {
        dispatch(foodsIsLoading(true));
        axios.get(API_FOODS)
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
    return axios.put(`API_GOALS/${goal.id}`, goal, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getGoal(cancelToken, goalId) {
    return axios.get(`API_GOALS/${goalId}`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createGoal(cancelToken, goal) {
    return axios.post(API_GOALS, goal, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getFeature(cancelToken, featureName) {
    return axios.get(`${API_FEATURES}/${featureName}`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function logIn(cancelToken, username, password) {
    return axios
        .post(`${API_AUTH}/login`, {
            username: username,
            password: password
        }, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function register(cancelToken, username, password) {
    return axios
        .post(`${API_AUTH}/register`, {
            username: username,
            password: password
        }, {cancelToken: cancelToken.token});
}

export function getAccount(cancelToken) {
    return axios
        .get(API, {cancelToken: cancelToken.token})
        .then(res => res.data)
        .catch(() => null);
}

export function logOut(cancelToken) {
    return axios.get(`${API_AUTH}/logout`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getConsumptions(cancelToken) {
    return axios
        .get(API_CONSUMPTIONS, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getConsumption(cancelToken, consumptionId) {
    return axios
        .get(`${API_CONSUMPTIONS}/${consumptionId}`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createConsumption(cancelToken, consumption) {
    return axios
        .post(API_CONSUMPTIONS, consumption, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function updateConsumption(cancelToken, consumption) {
    return axios
        .put(`${API_CONSUMPTIONS}/${consumption.id}`, consumption, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function deleteConsumption(cancelToken, consumptionId) {
    return axios
        .delete(`${API_CONSUMPTIONS}/${consumptionId}`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getFoods(search, isArchivedVisible) {
    const params = {};
    if (search && search.length) {
        params['search'] = search;
    }

    if (isArchivedVisible) {
        params['archived'] = 1;
    }

    return dispatch => {
        dispatch(foodsIsLoading(true));
        axios.get(API_FOODS, {params: params})
            .then(response => {
                dispatch(foodsIsLoading(false));
                return response;
            })
            .then(response => response.data)
            .then(foods => dispatch(foodsFetchDataSuccess(foods)))
            .catch(() => dispatch(foodsHasErrored(true)));
    };
}

export function getFood(cancelToken, foodId) {
    return axios
        .get(`${API_FOODS}/${foodId}`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function updateFood(cancelToken, food) {
    return axios
        .put(`${API_FOODS}/${food.id}`, food, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createFood(cancelToken, food) {
    return axios
        .post(API_FOODS, food, {cancelToken: cancelToken.token})
        .then(res => res.data);
}
