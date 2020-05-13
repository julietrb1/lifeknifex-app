import {IBackendItem} from "./IBackendItem";

export default interface IConsumption extends IBackendItem {
    food: string;
    date: string;
    quantity: number;
    food_name: string;
    food_icon: string;
}