import { FormInput } from "@/Components/FormInput";
import FormModal from "@/Components/Modal/FormModal";
import { router, useForm } from "@inertiajs/react";
import { useEffect } from "react";

export type UserPayload = {
    id?: number | string | null;
    name: string;
    email: string;
    user_group_id?: number | string | null;
    password?: string;
    password_confirmation?: string;
};

export interface UserFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "update";
    initialValues: UserPayload;
    userGroups: { value: number | string; label: string }[];
}


export default function UserForm({
    open,
    onOpenChange,
    mode,
    initialValues,
    userGroups,
}: UserFormProps) {
    const isCreate = mode === "create";
    const { data, setData, post, put, processing, reset, errors, clearErrors } =
        useForm<UserPayload>({
            id: initialValues?.id ?? null,
            name: initialValues?.name ?? "",
            email: initialValues?.email ?? "",
            user_group_id: initialValues?.user_group_id ?? undefined,
            password: "",
            password_confirmation: "",
        });

    // Sync internal form state when modal opens or initialValues change
    useEffect(() => {
        if (open) {
            setData({
                id: initialValues?.id ?? null,
                name: initialValues?.name ?? "",
                email: initialValues?.email ?? "",
                user_group_id: initialValues?.user_group_id ?? undefined,
                password: "",
                password_confirmation: "",
            });
            clearErrors();
        }
    }, [open, initialValues]);

    const handleSubmit = () => {
        return new Promise<void>((resolve, reject) => {
            if (isCreate) {
                post(route("user.store"), {
                    onSuccess: () => {
                        reset();
                        clearErrors();
                        resolve();
                    },
                    onError: () => reject(),
                    onFinish: () => {
                        // keep as is; errors cleared on open/close
                    },
                    preserveScroll: true,
                });
            } else if (data.id != null) {
                put(route("user.update", data.id), {
                    preserveScroll: true,
                    preserveState: true,
                    onSuccess: () => {
                        reset();
                        clearErrors();
                        resolve();
                    },
                    onError: () => {
                        // keep modal open and show errors in `errors`
                        reject();
                    },
                });
            } else {
                resolve();
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
        <FormModal
            open={open}
            onOpenChange={handleOpenChange}
            mode={mode}
            title={isCreate ? "Créer un utilisateur" : "Modifier l'utilisateur"}
            initialValues={data}
            onSubmit={handleSubmit}
            render={() => (
                <div className="space-y-4">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Groupe</label>
                        <select className={`w-full rounded-md border px-3 py-2 text-sm ${ errors.user_group_id ? "border-red-500" : "border-gray-300"}`}
                            value={ data.user_group_id != null ? String(data.user_group_id) : "" }
                            onChange={(e) => setData("user_group_id", e.target.value || null) }
                        >
                            <option value="">Veuillez sélectionner…</option>
                            {userGroups.map((g, idx) => (
                                <option key={idx} value={g.value}>{g.label}</option>
                            ))}
                        </select>
                        {errors.user_group_id && (
                            <div className="text-xs text-red-600">
                                {" "}
                                {errors.user_group_id}{" "}
                            </div>
                        )}
                    </div>
                    <FormInput name="name" value={data.name}
                        label="Nom"
                        error={errors.name}
                        onChange={setData}
                    />

                    <FormInput name="email" type="email" value={data.email}
                        label="Email"
                        error={errors.email}
                        onChange={setData}
                    />

                    <FormInput name="password" value={data.password ?? ""}
                        label={ isCreate ? "Mot de passe" : "Nouveau mot de passe " }
                        type="password"
                        error={errors.password}
                        onChange={setData}
                    />

                    <FormInput name="password_confirmation" value={data.password_confirmation ?? ""}
                        label={ isCreate ? "Confirmer le mot de passe" : "Confirmer le nouveau mot de passe" }
                        type="password"
                        onChange={setData}
                        error={errors.password_confirmation}
                    />
                </div>
            )}
        />
    );
}
