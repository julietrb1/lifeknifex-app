import moment from "moment";
import {SemanticCOLORS, SemanticICONS} from "semantic-ui-react/dist/commonjs/generic";

export const healthStrings = ['Healthy', 'Reasonable', 'Poor', 'Unhealthy'];
export const consumptionSizes = ['Small', 'Medium', 'Large', 'Extra Large'];
export const consumptionIcons: SemanticICONS[] = ['thermometer empty', 'thermometer half', 'thermometer three quarters', 'thermometer full'];
export const foodIcons: SemanticICONS[] = ['angle double up', 'angle up', 'angle down', 'angle double down'];
export const foodColors: SemanticCOLORS[] = ['teal', 'green', 'orange', 'red'];

export const firstCase = (text: string, isUpper: boolean = false) => `${isUpper ?
    text.charAt(0).toUpperCase() :
    text.charAt(0).toLowerCase()}${text.slice(1)}`;

export const extractError = (err: any) => {
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
        return data.errors.map((error: { msg: string }) => error.msg);
    } else if (data && typeof data === 'string') {
        return [data];
    } else if (err.response && err.response.statusText) {
        return [err.response.statusText];
    } else {
        return [unknownErrorMessage];
    }
};

export function getRelativeMoment(dateString: string) {
    return moment(dateString).calendar(undefined, {
        sameDay: '[Today]',
        nextDay: '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: '[Yesterday]',
        lastWeek: '[Last] dddd',
        sameElse: 'DD/MM/YYYY'
    });
}

export const arrayToObject = (array: any[], keyField: string) =>
    array.reduce((obj, item) => {
        obj[item[keyField]] = item;
        return obj;
    }, {});