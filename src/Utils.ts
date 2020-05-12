import moment from "moment";
import {SemanticCOLORS, SemanticICONS} from "semantic-ui-react/dist/commonjs/generic";
import IGoal from "./models/IGoal";
import {useEffect, useState} from "react";

export const healthStrings = ['Healthy', 'Reasonable', 'Poor', 'Unhealthy'];
export const consumptionSizes = ['Small', 'Medium', 'Large', 'Extra Large'];
export const consumptionIcons: SemanticICONS[] = ['thermometer empty', 'thermometer half', 'thermometer three quarters', 'thermometer full'];
export const foodIcons: SemanticICONS[] = ['angle double up', 'angle up', 'angle down', 'angle double down'];
export const foodColors: SemanticCOLORS[] = ['teal', 'green', 'orange', 'red'];

export const firstCase = (text: string, isUpper: boolean = false) => `${isUpper ?
    text.charAt(0).toUpperCase() :
    text.charAt(0).toLowerCase()}${text.slice(1)}`;

export const handleStoreError = (e: any) => {
    if (!e.toString().includes('No refresh token')) throw(Error(extractError(e)));
}

export const extractError = (err: any) => {
    const unknownErrorMessage = 'Unknown error occurred - please contact support';
    if (typeof err === 'string') return err;
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

export function useDebounce(value: string, delay: number) {
    // State and setters for debounced value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(
        () => {
            // Update debounced value after delay
            const handler = setTimeout(() => {
                setDebouncedValue(value);
            }, delay);

            // Cancel the timeout if value changes (also on delay change or unmount)
            // This is how we prevent debounced value from updating if value is changed ...
            // .. within the delay period. Timeout gets cleared and restarted.
            return () => {
                clearTimeout(handler);
            };
        },
        [value, delay] // Only re-call effect if value or delay changes
    );

    return debouncedValue;
}

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

export function getAnswerName(goal: IGoal) {
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