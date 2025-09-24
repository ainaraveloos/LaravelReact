import { DataTable } from "@/Components/DataTable/DataTable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { PageProps } from "@/types";
import type { Action, Column } from "@/types/DataTable";
import { Head, Link, router, usePage } from "@inertiajs/react";
import type { UserRow } from "./Types/Index";

type PageData = {
    data: {
        data: UserRow[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    user_groupes: { value: number | string; label: string }[];
    filters: { search?: string };
};

export default function UserIndex() {
    const page = usePage<PageProps & PageData>();
    const { data, user_groupes, filters } = page.props;
    const handleAdd = () => {

    }
    const handleUpdate = (id:number|string) => {
        console.log(id);
    }

    const columns: Column<UserRow>[] = [
        { key: "index", label: "#" },
        { key: "name", label: "Nom" },
        { key: "email", label: "Email" },
        { key: "user_group_name", label: "Groupe" },
    ];

    const actions: Action<UserRow>[] = [
        {
            label: "Modifier",
            privilege: "user.edit",
            onClick: (row) => handleUpdate(row.id),
        },
        {
            label: "Supprimer",
            privilege: "user.destroy",
            disabled: (row) => Boolean(row.is_you),
            onClick: (row) => {
                if (!confirm("Supprimer cet utilisateur ?")) return;
                router.delete(route("user.destroy", row.id));
            },
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Utilisateurs" />
            <DataTable<UserRow>
                data={data}
                columns={columns}
                actions={actions}
                filters={filters}
                endpoint={route("user.index")}
            />
        </AuthenticatedLayout>
    );
}
