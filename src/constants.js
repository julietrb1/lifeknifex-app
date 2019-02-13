export const APP_TITLE = 'LifeKnifeX';
export const COLOR_NUTRITION = 'orange';
export const COLOR_GOALS = 'pink';
export const COLOR_CAREER = 'purple';
export const COLOR_MOOD = 'teal';
export const COLOR_SCORE = 'olive';
export const COLOR_ACCOUNT = 'yellow';
export const TIME_FORMAT_STRING = 'h a';
export const API_FEATURE_REGISTRATION_ENABLED = 'registrationEnabled';

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

export const API = `${backendUrl}/api/v1`;