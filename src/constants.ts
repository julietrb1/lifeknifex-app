export const APP_TITLE = 'LifeKnifeX';
export const COLOR_NUTRITION = 'orange';
export const COLOR_GOALS = 'pink';
export const COLOR_CAREER = 'purple';
export const COLOR_MOOD = 'teal';
export const COLOR_SCORE = 'olive';
export const COLOR_ACCOUNT = 'yellow';
export const TIME_FORMAT_STRING = 'h a';
export const API_FEATURE_REGISTRATION_ENABLED = 'registrationEnabled';
export const BACKEND_DATE_FORMAT = 'YYYY-MM-DD';
export const XSRF_COOKIE_NAME = 'csrftoken';
export const XSRF_HEADER_NAME = 'X-CSRFToken';
export const ERROR_MSG_SESSION_EXPIRED = 'Session expired';

export const foodIcons = [
  'Avocado', 'Bacon', 'Banana', 'Beef', 'Carrot', 'Cheese', 'Chicken', 'Chocolate', 'Cookie', 'Egg', 'Grapes',
  'Ice cream', 'Milkshake', 'Mushroom', 'Nachos', 'Oats', 'Orange', 'Pasta', 'Peanut', 'Scone', 'Sushi', 'Toast',
  'Wrap', 'Yogurt',
].map((iconText) => {
  const value = iconText.toLowerCase().replace(/\s+/g, '_');
  return ({
    text: iconText,
    value,
    image: `/img/food_icons/${value}.svg`,
  });
});
