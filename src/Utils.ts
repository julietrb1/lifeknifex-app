import moment from 'moment';
import { SemanticCOLORS, SemanticICONS } from 'semantic-ui-react/dist/commonjs/generic';
import { useEffect, useState } from 'react';
import { AxiosError } from 'axios';
import IGoal from './models/IGoal';
import { ERROR_MSG_SESSION_EXPIRED } from './constants';

export const healthStrings = ['Healthy', 'Reasonable', 'Poor', 'Unhealthy'];
export const consumptionSizes = ['Small', 'Medium', 'Large', 'Extra Large'];
export const consumptionIcons: SemanticICONS[] = ['thermometer empty', 'thermometer half', 'thermometer three quarters', 'thermometer full'];
export const foodIcons: SemanticICONS[] = ['angle double up', 'angle up', 'angle down', 'angle double down'];
export const foodColors: SemanticCOLORS[] = ['teal', 'green', 'orange', 'red'];

export const firstCase = (text: string, isUpper: boolean = false) => `${isUpper
  ? text.charAt(0).toUpperCase()
  : text.charAt(0).toLowerCase()}${text.slice(1)}`;

const extractErrorUnlimited = (err: any) => {
  if (!err.isAxiosError) {
    if (err.message) return err.message;
    return err;
  }
  const axiosError = err as AxiosError;
  if (axiosError.message && !axiosError.response) return axiosError.message;
  const data = axiosError?.response?.data;
  if (data.non_field_errors && Array.isArray(data.non_field_errors)) return data.non_field_errors;
  if (data.detail) return data.detail;
  if (data.message) return data.message;
  if (data.errors && typeof Array.isArray(data.errors) && data.errors.length) return data.errors.map((error: any) => error.msg).join(', ');
  if (data && typeof data === 'string') return data;

  const entries = Object.entries(data);
  if (entries.length) return entries.map(([k, v]) => `${k}: ${v}`).join(', ');
  if (Object.keys(data).length) return Object.values(data).join(', ');
  if (axiosError?.response?.statusText) return axiosError.response.statusText;

  return 'Unknown error occurred - please contact support';
};

export const extractError = (err: any) => String(extractErrorUnlimited(err)).substr(0, 150);

export const handleStoreError = (e: any) => {
  throw Error(extractError(e));
};

export const extractStoreError = (e: any) => {
  if (e?.message !== ERROR_MSG_SESSION_EXPIRED) return extractError(e);
  return '';
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
    [value, delay], // Only re-call effect if value or delay changes
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
    sameElse: 'DD/MM/YYYY',
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

export const getCookie = (name: string): string | null => {
  const nameLenPlus = (name.length + 1);
  return document.cookie
    .split(';')
    .map((c) => c.trim())
    .filter((cookie) => cookie.substring(0, nameLenPlus) === `${name}=`)
    .map((cookie) => decodeURIComponent(cookie.substring(nameLenPlus)))[0] || null;
};
