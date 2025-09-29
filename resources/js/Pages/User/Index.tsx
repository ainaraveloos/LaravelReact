import { DataTable } from "@/Components/DataTable/DataTable";
import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { PageProps } from "@/types";
import type { Action, Column } from "@/types/DataTable";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import UserForm from "./Form/UserForm";
import type { UserRow } from "./Types/Index";

type PageData = {
    data: { data: UserRow[]; current_page: number; per_page: number; total: number; last_page: number; };
    user_groupes: { value: number | string; label: string }[];
    filters: { search?: string };
    flash?: any;
};

export default function UserIndex() {
    const page = usePage<PageProps & PageData>();
    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "update">("create");
    const [selectedIds, setSelectedIds] = useState<(number | string)[]>([]);
    const [initialValues, setInitialValues] = useState<{
        id?: number | string | null;
        name: string;
        email: string;
        user_group_id?: number | string | null;
    }>({ id: null, name: "", email: "" });

    const { data, filters, user_groupes, flash } = page.props;


    // Open update modal when flash contains a user (coming from controller show())
    useEffect(() => {
        const f = flash as any;
        if (f && f.user && f.user.id) {
            const u = f.user
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
        setInitialValues({ id: null, name: "", email: "", user_group_id: undefined});
        setOpen(true);
    };
    const handleUpdate = (id: number | string) => {
        router.get(route("user.show", id),{},{ preserveScroll: true, preserveState: true });
    };

    const columns: Column<UserRow>[] = [
        // { key: "index", label: "#" },
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
            <div className="flex items-center justify-between mb-4">
                {selectedIds.length >0 && (
                    <Button onClick={() => alert(selectedIds)}>({selectedIds.length})</Button>
                )}
                <Button onClick={handleAdd}>Ajouter un utilisateur</Button>{" "}
            </div>
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
