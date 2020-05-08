import moment from "moment";
import {SemanticCOLORS, SemanticICONS} from "semantic-ui-react/dist/commonjs/generic";
import {IGoal} from "./reducers/goals";
import {IBackendItem} from "./models/IBackendItem";

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

export function getRelativeMoment(dateString: string, firstLower?: boolean) {
    return moment(dateString).calendar(undefined, {
        sameDay: firstLower ? '[today]' : '[Today]',
        nextDay: firstLower ? '[tomorrow]' : '[Tomorrow]',
        nextWeek: 'dddd',
        lastDay: firstLower ? '[yesterday]' : '[Yesterday]',
        lastWeek: firstLower ? '[last] dddd' : '[Last] dddd',
        sameElse: 'DD/MM/YYYY'
    });
}

export const arrayToObject = (array: any[] | undefined, keyField: string) =>
    (array || []).reduce((obj, item) => {
        obj[item[keyField]] = item;
        return obj;
    }, {});

// export const arrayToIndexedArray: [string, IBackendItem] = (array: IBackendItem[] | undefined) =>
//     (array || []).map(item => [String(item.url), item]);

export const arrayToIndexed = <T extends IBackendItem>(array: T[] | undefined) =>
    (array || []).reduce((acc, cur) => {
        acc.push([String(cur.url), cur]);
        return acc;
    }, new Array<[string, T]>());

export interface IStoreState<T extends IBackendItem> {
    [url: string]: T;
}

export function getGoalAnswerName(goal: IGoal) {
    switch (goal.style) {
        case 'yesno':
            switch (goal.todays_answer_value) {
                case 1:
                    return 'Yes';
                case 2:
                    return 'No';
                default:
                    return null;
            }
        case 'likert':
            switch (goal.todays_answer_value) {
                case 1:
                    return 'Effectively';
                case 2:
                    return 'Adequately';
                case 3:
                    return 'Poorly';
                case 4:
                    return 'Unsuccessfully';
                default:
                    return null;
            }
        default:
            return null;
    }
}