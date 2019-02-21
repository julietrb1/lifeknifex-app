export interface IPaginatedResponse<T> {
    count?: number;
    next?: string;
    previous?: string;
    results?: T[];
}

export interface IBackendItem {
    id?: number;
    url?: string;
}