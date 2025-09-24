import { DataTable } from "@/Components/DataTable/DataTable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { PageProps } from "@/types";
import type { Action, Column } from "@/types/DataTable";
import { Head, router, usePage } from "@inertiajs/react";
import type { UserGroupRow } from "./Types/Index";

type PageData = {
    data: {
        data: UserGroupRow[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    privilege: Record<string, string> | string[];
    filters: { search?: string };
};

export default function UserGroupIndex() {
    const page = usePage<PageProps & PageData>();
    const { data, filters } = page.props;

    const columns: Column<UserGroupRow>[] = [
        { key: "index", label: "#" },
        { key: "name", label: "Nom" },
    ];

    const actions: Action<UserGroupRow>[] = [
        {
            label: "Modifier",
            privilege: "group_user.edit",
            onClick: (row) => router.get(route("group_user.edit", row.id)),
        },
        {
            label: "Supprimer",
            privilege: "group_user.destroy",
            onClick: (row) => {
                if (!confirm("Supprimer ce groupe ?")) return;
                router.delete(route("group_user.destroy", row.id));
            },
        },
    ];

    return (
        <AuthenticatedLayout>
            <Head title="Groupes d'utilisateurs" />

            <DataTable<UserGroupRow>
                data={data}
                columns={columns}
                actions={actions}
                filters={filters}
                endpoint={route("group_user.index")}
            />
        </AuthenticatedLayout>
    );
}
