export interface IConsumptionFormState {
    isLoading: boolean;
    submissionMessage: string;
    foodResults: any[];
    currentFoodSearch: string;
    consumption: any;
    availableHours: { text: string, value: string, key: number }[];
    food?: any;
    submissionError: string;
    isDeleteVisible: boolean;
    searchLoading: boolean;
}