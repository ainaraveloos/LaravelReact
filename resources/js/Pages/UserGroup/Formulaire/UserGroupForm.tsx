import { FormInput } from "@/Components/FormInput";
import FormModal from "@/Components/Modal/FormModal";
import PrivilegeTree from "@/Components/PrivilegeTree";
import { useForm } from "@inertiajs/react";
import { useEffect } from "react";

export type UserGroupPayload = {
    id?: number | string | null;
    name: string;
    privileges: string[];
};

export interface UserGroupFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "update";
    initialValues: UserGroupPayload;
    privilegesDef: any[];
    groupId?: number | string;
}

export default function UserGroupForm({
    open,
    onOpenChange,
    mode,
    initialValues,
    privilegesDef,
    groupId,
}: UserGroupFormProps) {
    const isCreate = mode === "create";

    const { data, setData, post, put, processing, reset, errors, clearErrors } =
        useForm<UserGroupPayload>({
            id: initialValues?.id ?? null,
            name: initialValues?.name ?? "",
            privileges: initialValues?.privileges ?? [],
        });

    useEffect(() => {
        if (open) {
            setData({
                id: initialValues?.id ?? null,
                name: initialValues?.name ?? "",
                privileges: initialValues?.privileges ?? [],
            });
            clearErrors();
        }
    }, [open, initialValues]);

    const handleSubmit = () => {
        return new Promise<void>((resolve, reject) => {
            if (isCreate) {
                post(route("group_user.store"), {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        clearErrors();
                        resolve();
                    },
                    onError: () => reject(),
                });
            } else {
                const targetId = data.id ?? groupId;
                if (targetId == null) {
                    resolve();
                    return;
                }
                put(route("group_user.update", targetId), {
                    preserveScroll: true,
                    onSuccess: () => {
                        reset();
                        clearErrors();
                        resolve();
                    },
                    onError: () => reject(),
                });
            }
        });
    };

    const handleOpenChange = (nextOpen: boolean) => {
        if (!nextOpen) {
            reset();
            clearErrors();
        }
        onOpenChange(nextOpen);
    };

    return (
        <FormModal<UserGroupPayload>
            open={open}
            onOpenChange={handleOpenChange}
            mode={mode}
            size="full_screen"
            title={isCreate ? "Créer un groupe" : "Modifier le groupe"}
            initialValues={data}
            onSubmit={handleSubmit}
            render={() => (
                <div className="space-y-4">
                    <FormInput
                        name="name"
                        label="Nom"
                        value={data.name}
                        onChange={setData}
                        error={errors.name}
                    />
                    {/* Privileges selector */}
                    <div className="space-y-2">
                        <PrivilegeTree
                            privilegesDef={privilegesDef}
                            value={data.privileges}
                            onChange={(routes) => setData("privileges", routes)}
                        />
                    </div>
                </div>
            )}
        />
    );
}
