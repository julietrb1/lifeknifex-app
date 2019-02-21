export const APP_TITLE = 'LifeKnifeX';
export const COLOR_NUTRITION = 'orange';
export const COLOR_GOALS = 'pink';
export const COLOR_CAREER = 'purple';
export const COLOR_MOOD = 'teal';
export const COLOR_SCORE = 'olive';
export const COLOR_ACCOUNT = 'yellow';
export const TIME_FORMAT_STRING = 'h a';
export const API_FEATURE_REGISTRATION_ENABLED = 'registrationEnabled';
export const LOCAL_STORAGE_JWT_ACCESS = 'jwt-access';
export const LOCAL_STORAGE_JWT_REFRESH = 'jwt-refresh';
export const BACKEND_DATE_FORMAT = 'YYYY-MM-DD';

let backendUrl: string | undefined = ''; // TODO: Check this so that it isn't undefined
switch (document.location.hostname) {
    case 'app.lifeknifex.com':
        backendUrl = process.env.REACT_APP_BACKEND_URL_PROD;
        break;
    case 'lifeknifex-app.herokuapp.com':
        backendUrl = process.env.REACT_APP_BACKEND_URL;
        break;
    default:
        backendUrl = 'http://localhost:8000/';
        break;
}

export const API = `${backendUrl}`;
export const foodIcons = [
    'Avocado', 'Bacon', 'Banana', 'Beef', 'Carrot', 'Cheese', 'Chicken', 'Chocolate', 'Cookie', 'Egg', 'Grapes',
    'Ice cream', 'Milkshake', 'Mushroom', 'Nachos', 'Oats', 'Orange', 'Pasta', 'Peanut', 'Scone', 'Sushi', 'Toast',
    'Wrap', 'Yogurt'
].map(iconText => {
    const value = iconText.toLowerCase().replace(/\s+/g, '_');
    return ({
        text: iconText,
        value: value,
        image: `/img/food_icons/${value}.svg`
    });
});