export interface IPaginatedResponse<T> {
    count?: number;
    next?: string;
    previous?: string;
    results?: T[];
}

export interface BackendItem {
    id: number;
    url: string;
}