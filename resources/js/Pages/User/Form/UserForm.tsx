import FormModal from "@/Components/Modal/FormModal";
import { Input } from "@/Components/ui/input";

export type UserPayload = {
    name: string;
    email: string;
    user_group_id?: number | string | null;
    password?: string;
};

export interface UserFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "update";
    initialValues: UserPayload;
    onSubmit: (values: UserPayload) => void | Promise<void>;
    userGroups: { value: number | string; label: string }[];
}

export default function UserForm({
    open,
    onOpenChange,
    mode,
    initialValues,
    onSubmit,
    userGroups,
}: UserFormProps) {
    const isCreate = mode === "create";

    return (
        <FormModal<UserPayload>
            open={open}
            onOpenChange={onOpenChange}
            mode={mode}
            title={isCreate ? "Créer un utilisateur" : "Modifier l'utilisateur"}
            initialValues={initialValues}
            onSubmit={onSubmit}
            render={({ values, setValues }) => (
                <div className="space-y-3">
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Nom</label>
                        <Input
                            value={values.name}
                            onChange={(e) =>
                                setValues({ ...values, name: e.target.value })
                            }
                            placeholder="Nom"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Email</label>
                        <Input
                            type="email"
                            value={values.email}
                            onChange={(e) =>
                                setValues({ ...values, email: e.target.value })
                            }
                            placeholder="email@example.com"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">Groupe</label>
                        <select
                            className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={values.user_group_id ?? ""}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    user_group_id: e.target.value,
                                })
                            }
                        >
                            <option value="" disabled>
                                Sélectionner un groupe
                            </option>
                            {userGroups.map((g) => (
                                <option key={g.value} value={g.value}>
                                    {g.label}
                                </option>
                            ))}
                        </select>
                    </div>
                    {isCreate && (
                        <div className="space-y-1">
                            <label className="text-sm font-medium">
                                Mot de passe
                            </label>
                            <Input
                                type="password"
                                value={values.password ?? ""}
                                onChange={(e) =>
                                    setValues({
                                        ...values,
                                        password: e.target.value,
                                    })
                                }
                                placeholder=""
                            />
                        </div>
                    )}
                </div>
            )}
        />
    );
}
