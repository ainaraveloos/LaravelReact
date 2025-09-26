export type Column<T> = {
    key: keyof T | "index";
    label: string;
    render?: (row: T, index: number) => React.ReactNode;
};

export type Action<T> = {
    label: string;
    onClick: (row: T) => void;
    visible?: (row: T) => boolean;
    disabled?: (row: T) => boolean;
    privilege?: string | (() => string);
};

export interface PaginationMeta {
    current_page: number;
    per_page: number;
    total: number;
    last_page: number;
}

export interface DataTableProps<T> {
    data: {
        data: T[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    columns: Column<T>[];
    actions?: Action<T>[];
    filters?: Record<string, any>;
    endpoint: string;
    selectableRows?: boolean;
    selectedIds?: Array<string | number>;
    onSelectionChange?: (ids: Array<string | number>) => void;
}
