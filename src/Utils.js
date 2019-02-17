import moment from "moment";

export const healthStrings = ['Healthy', 'Reasonable', 'Poor', 'Unhealthy'];
export const consumptionSizes = ['Small', 'Medium', 'Large', 'Extra Large'];
export const consumptionIcons = ['thermometer empty', 'thermometer half', 'thermometer three quarters', 'thermometer full'];
export const foodIcons = ['angle double up', 'angle up', 'angle down', 'angle double down'];
export const foodColors = ['teal', 'green', 'orange', 'red'];

export const extractError = err => {
    const unknownErrorMessage = 'Unknown error occurred - please contact support';
    if (!err) {
        return [unknownErrorMessage];
    } else if (err.message && !err.response) {
        return [err.message];
    }
    const data = err.response.data;
    if (data.non_field_errors && Array.isArray(data.non_field_errors)) {
        return data.non_field_errors;
    }
    if (data.message) {
        return [data.message];
    } else if (data.errors && typeof Array.isArray(data.errors) && data.errors.length) {
        return data.errors.map(error => error.msg);
    } else if (data && typeof data === 'string') {
        return [data];
    } else if (err.response && err.response.statusText) {
        return [err.response.statusText];
    } else {
        return [unknownErrorMessage];
    }
};

export function getRelativeMoment(dateString) {
    return moment(dateString).calendar(null, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'DD/MM/YYYY'
    });
}