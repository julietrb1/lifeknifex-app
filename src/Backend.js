import axios from 'axios';

axios.defaults.withCredentials = true;
const API = '/api';
const API_FEATURES = `${API}/features`;
const API_ACCOUNT = `${API}/account`;
const API_CONSUMPTION = `${API}/consumption`;
const API_FOOD = `${API}/food`;

export function getFeature(cancelToken, featureName) {
    return axios.get(`${API_FEATURES}/${featureName}`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function logIn(cancelToken, username, password) {
    return axios
        .post(`${API_ACCOUNT}/login`, {
            username: username,
            password: password
        }, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function register(cancelToken, username, password) {
    return axios
        .post(`${API_ACCOUNT}/register`, {
            username: username,
            password: password
        }, {cancelToken: cancelToken.token});
}

export function getAccount(cancelToken) {
    return axios
        .get(API, {cancelToken: cancelToken.token})
        .then(res => res.data.account)
        .catch(() => null);
}

export function logOut(cancelToken) {
    return axios.get(`${API_ACCOUNT}/logout`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getConsumptions(cancelToken) {
    return axios
        .get(API_CONSUMPTION, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getConsumption(cancelToken, consumptionId) {
    return axios
        .get(`${API_CONSUMPTION}/${consumptionId}`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createConsumption(cancelToken, consumption) {
    return axios
        .post(API_CONSUMPTION, consumption, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function updateConsumption(cancelToken, consumption) {
    return axios
        .put(`${API_CONSUMPTION}/${consumption.id}`, consumption, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function deleteConsumption(cancelToken, consumptionId) {
    return axios
        .delete(`${API_CONSUMPTION}/${consumptionId}`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getFoods(cancelToken, search, isArchivedVisible) {
    const queryParams = new URLSearchParams();
    if (search && search.length) {
        queryParams.append('search', search);
    }

    if (isArchivedVisible) {
        queryParams.append('archived', '1');
    }

    const url = `${API_FOOD}?${queryParams}`;
    return axios
        .get(url, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function getFood(cancelToken, foodId) {
    return axios
        .get(`${API_FOOD}/${foodId}`, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function updateFood(cancelToken, food) {
    return axios
        .put(`${API_FOOD}/${food.id}`, food, {cancelToken: cancelToken.token})
        .then(res => res.data);
}

export function createFood(cancelToken, food) {
    return axios
        .post(API_FOOD, food, {cancelToken: cancelToken.token})
        .then(res => res.data);
}
