export interface UserGroupRow {
    id: number | string;
    name: string;
    privileges?: string[] | Record<string, any> | null;
    users_count?: number;
}
