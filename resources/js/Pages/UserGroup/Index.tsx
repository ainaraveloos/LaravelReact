import { DataTable } from "@/Components/DataTable/DataTable";
import ColumnPickerExport from "@/Components/Export/ColumnPickerExport";
import FilterBase from "@/Components/Filter/FilterBase";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { PageProps } from "@/types";
import type { Action, Column } from "@/types/DataTable";
import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "antd";
import { useEffect, useState } from "react";
import UserGroupForm, {
    type UserGroupPayload,
} from "./Formulaire/UserGroupForm";
import type { UserGroupRow } from "./Types/Index";

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
        router.get(
            route("group_user.index"),
            { ...filter },
            { preserveScroll: true, preserveState: true }
        );
    };
    const resetFilter = () => {
        setFilterState({ search: "" });
        router.get(
            route("group_user.index"),
            { search: "" },
            { preserveScroll: true, preserveState: true }
        );
    };
    useEffect(() => {
        const f = flash as any;
        if (f && f.usergroup && f.usergroup.id) {
            const u = f.usergroup;
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
            icon: "edit",
            onClick: (row) => handleUpdate(row.id),
        },
        {
            label: "Supprimer",
            privilege: "group_user.destroy",
            icon: "trash",
            classStyle: "text-red-400 hover:text-red-500 duration-300",
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
                    <>
                        <ColumnPickerExport
                            columns={[
                                { header: "Id", field: "id" },
                                { header: "Nom", field: "name" },
                            ]}
                            exportUrl={route("usergroup.export.excel")}
                            buttonText="Exporter"
                        />
                        <Button
                            type="primary"
                            size="large"
                            onClick={handleCreate}
                        >
                            {" "}
                            Créer un groupe{" "}
                        </Button>
                    </>
                )}
            />
            <DataTable<UserGroupRow>
                data={data}
                columns={columns}
                actions={actions}
                filters={filters}
                actionOnDropdown={false}
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
