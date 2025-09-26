import { DataTable } from "@/Components/DataTable/DataTable";
import { Button } from "@/Components/ui/button";
import AuthenticatedLayout from "@/Layouts/AuthenticatedLayout";
import type { PageProps } from "@/types";
import type { Action, Column } from "@/types/DataTable";
import { Head, router, usePage } from "@inertiajs/react";
import { useEffect, useState } from "react";
import { type UserGroupPayload } from "./Formulaire/UserGroupForm";
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
    selectedgroup?: {
        id: number | string;
        name: string;
        privileges?: string[];
    } | null;
};

export default function UserGroupIndex() {
    const page = usePage<PageProps & PageData>();
    const { data, filters, privilege, selectedgroup } = page.props;

    const [open, setOpen] = useState(false);
    const [mode, setMode] = useState<"create" | "update">("create");
    const [initialValues, setInitialValues] = useState<UserGroupPayload>({
        name: "",
        privileges: [],
    });

    // Open update modal when selectedgroup is provided by backend (via show())
    useEffect(() => {
        if (selectedgroup && selectedgroup.id) {
            setMode("update");
            setInitialValues({
                name: selectedgroup.name ?? "",
                privileges: Array.isArray(selectedgroup.privileges)
                    ? selectedgroup.privileges
                    : [],
            });
            setOpen(true);
        }
    }, [selectedgroup]);

    const handleCreate = () => {
        setMode("create");
        setInitialValues({ name: "", description: "", privileges: [] });
        setOpen(true);
    };

    const handleSubmit = async (values: UserGroupPayload) => {
        if (mode === "create") {
            return new Promise<void>((resolve, reject) => {
                router.post(route("group_user.store"), values, {
                    preserveScroll: true,
                    onSuccess: () => {
                        setOpen(false);
                        resolve();
                    },
                    onError: () => reject(),
                });
            });
        } else if (selectedgroup && selectedgroup.id) {
            return new Promise<void>((resolve, reject) => {
                router.visit(route("group_user.update", selectedgroup.id), {
                    method: "put",
                    data: values,
                    preserveScroll: true,
                    onSuccess: () => {
                        setOpen(false);
                        resolve();
                    },
                    onError: () => reject(),
                });
            });
        }
    };

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

            <div className="flex items-center justify-end mb-4">
                <Button onClick={handleCreate}>Créer un groupe</Button>
            </div>

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
