export interface UserRow {
    id: number|string;
    name: string;
    email: string;
    user_group_id?: number | string | null;
    user_group_name?: string | null;
    is_you?: boolean;
}
