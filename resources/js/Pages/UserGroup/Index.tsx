import { DataTable } from "@/Components/DataTable/DataTable";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { PageProps } from "@/types";
import type { Action, Column } from "@/types/DataTable";
import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "antd";
import { useEffect, useState } from "react";
import UserGroupForm, { type UserGroupPayload } from "./Formulaire/UserGroupForm";
import type { UserGroupRow } from "./Types/Index";
import FilterBase from "@/Components/Filter/FilterBase";

type PageData = {
    data: {
        data: UserGroupRow[];
        current_page: number;
        per_page: number;
        total: number;
        last_page: number;
    };
    privilege: any[];
    filters: { search?: string };
    flash?: any;
    selectedgroup?: {
        id: number | string;
        name: string;
        privileges?: string[];
    } | null;
};

export default function UserGroupIndex() {
    const page = usePage<PageProps & PageData>();
    const { data, filters, privilege, flash } = page.props;

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "update">("create");
    const [initialValues, setInitialValues] = useState<UserGroupPayload>({
        id: null,
        name: "",
        privileges: [],
    });
    const [filterState, setFilterState] = useState<{ search?: string }>({
        search: filters?.search ?? "",
    });
    const applyFilter = (filter: { search?: string }) => {
        setFilterState(filter);
        router.get(route("group_user.index"), { ...filter }, { preserveScroll: true, preserveState: true });
    };
    const resetFilter = () => {
        setFilterState({ search: "" });
        router.get(route("group_user.index"), { search: "" }, { preserveScroll: true, preserveState: true });
    };
    useEffect(() => {
        const f = flash as any;
        if (f && f.usergroup && f.usergroup.id) {
            const u = f.usergroup
            setMode("update");
            setInitialValues({
                id: u.id,
                name: u.name ?? "",
                privileges: u.privileges ?? [],
            });
            setOpen(true);
        }
    }, [flash]);

    const handleCreate = () => {
        setMode("create");
        setInitialValues({ name: "", privileges: [] });
        setOpen(true);
    };
    const handleUpdate = (id: number | string) => {
        router.get(
            route("group_user.show", id),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const columns: Column<UserGroupRow>[] = [
        { key: "index", label: "#" },
        { key: "name", label: "Nom" },
    ];

    const actions: Action<UserGroupRow>[] = [
        {
            label: "Modifier",
            privilege: "group_user.edit",
            onClick: (row) => handleUpdate(row.id),
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
            <FilterBase
                value={filterState}
                onChange={setFilterState}
                onSearch={applyFilter}
                onReset={resetFilter}
                renderAdd={() => (
                    <Button type="primary" size="large" onClick={handleCreate}>
                        Créer un groupe
                    </Button>
                )}
            />
            <DataTable<UserGroupRow>
                data={data}
                columns={columns}
                actions={actions}
                filters={filters}
                endpoint={route("group_user.index")}
            />

            <UserGroupForm
                open={open}
                onOpenChange={setOpen}
                mode={mode}
                initialValues={initialValues}
                privilegesDef={privilege}
                groupId={initialValues.id ?? undefined}
            />
        </AuthenticatedLayout>
    );
}
