import { DataTable } from "@/Components/DataTable/DataTable";
import ColumnPickerExport from "@/Components/Export/ColumnPickerExport";
import FilterBase from "@/Components/Filter/FilterBase";
import { FormDefaultSelect } from "@/Components/FormDefaultSelect";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { PageProps } from "@/types";
import type { Action, Column } from "@/types/DataTable";
import { Head, router, usePage } from "@inertiajs/react";
import { Button } from "antd";
import { useEffect, useState } from "react";
import UserForm, { UserPayload } from "./Form/UserForm";
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
    flash?: any;
};

export default function UserIndex() {
    const page = usePage<PageProps & PageData>();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "update">("create");
    const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
    const [initialValues, setInitialValues] = useState<UserPayload>({
        id: null,
        name: "",
        email: "",
    });

    const { data, filters, user_groupes, flash } = page.props;

    // Filters state: search + user_group_id
    const [filterState, setFilterState] = useState<{
        search?: string;
        user_group_id?: number | string | null;
    }>(() => ({
        search: filters?.search ?? "",
        user_group_id: (filters as any)?.user_group_id ?? null,
    }));
    const applyFilter = (filter: {
        search?: string;
        user_group_id?: number | string | null;
    }) => {
        setFilterState(filter);
        router.get(
            route("user.index"),
            { ...filter },
            { preserveScroll: true, preserveState: true }
        );
    };
    const resetFilter = () => {
        setFilterState({ search: "", user_group_id: null });
        router.get(
            route("user.index"),
            { search: "", user_group_id: null },
            { preserveScroll: true, preserveState: true }
        );
    };

    // Open update modal when flash contains a user (coming from controller show())
    useEffect(() => {
        const f = flash as any;
        if (f && f.user && f.user.id) {
            const u = f.user;
            setMode("update");
            setInitialValues({
                id: u.id,
                name: u.name ?? "",
                email: u.email ?? "",
                user_group_id: u.user_group_id ?? null,
            });
            setOpen(true);
        }
    }, [flash]);
    const handleAdd = () => {
        setMode("create");
        setInitialValues({
            id: null,
            name: "",
            email: "",
            user_group_id: undefined,
        });
        setOpen(true);
    };
    const handleUpdate = (id: number | string) => {
        router.get(
            route("user.show", id),
            {},
            { preserveScroll: true, preserveState: true }
        );
    };

    const columns: Column<UserRow>[] = [
        { key: "index", label: "" },
        { key: "name", label: "Nom" },
        { key: "email", label: "Email" },
        { key: "user_group_name", label: "Groupe" },
    ];

    const actions: Action<UserRow>[] = [
        {
            label: "Modifier",
            privilege: "user.edit",
            icon: "edit",
            onClick: (row) => handleUpdate(row.id),
        },
        {
            label: "Supprimer",
            privilege: "user.destroy",
            icon: "trash",
            classStyle: "text-red-400 hover:text-red-500 duration-300",
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
            <FilterBase
                value={filterState}
                onChange={setFilterState}
                onSearch={applyFilter}
                onReset={() => resetFilter()}
                renderFilters={({ value, onChange }) => (
                    <div className="space-y-3">
                        <FormDefaultSelect
                            name="user_group_id"
                            label="Groupe utilisateur"
                            value={value.user_group_id}
                            options={user_groupes}
                            placeholder="Tous les groupes"
                            filterOption={(input: string, option: any) =>
                                (option?.label ?? "")
                                    .toLowerCase()
                                    .includes(input.toLowerCase())
                            }
                            onChange={(_, v) => onChange({ user_group_id: v })}
                        />
                    </div>
                )}
                renderAdd={() => (
                    <>
                        <ColumnPickerExport
                            exportUrl={route("user.export.excel")}
                            buttonText="Exporter"
                            columns={[
                                { header: "Id", field: "id" },
                                { header: "Nom", field: "name" },
                                { header: "Email", field: "email" },
                                {
                                    header: "Groupe d'Utilisateur",
                                    field: "group.name",
                                },
                            ]}
                        />
                        {selectedIds.length > 0 && (
                            <Button
                                type="default"
                                size="large"
                                onClick={() => alert(selectedIds)}
                            >
                                {" "}
                                Action{" "}
                            </Button>
                        )}
                        <Button type="primary" size="large" onClick={handleAdd}>
                            {" "}
                            Nouveau utilisateur{" "}
                        </Button>
                    </>
                )}
            />
            <DataTable
                data={data}
                columns={columns}
                actions={actions}
                filters={filters}
                endpoint={route("user.index")}
                selectableRows={true}
                selectedIds={selectedIds}
                onSelectionChange={setSelectedIds}
            />
            <UserForm
                open={open}
                onOpenChange={setOpen}
                mode={mode}
                initialValues={initialValues}
                userGroups={user_groupes}
            />
        </AuthenticatedLayout>
    );
}
