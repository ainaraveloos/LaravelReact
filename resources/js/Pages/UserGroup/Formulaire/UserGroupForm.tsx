import FormModal from "@/Components/Modal/FormModal";
import { Input } from "@/Components/ui/input";

export type UserGroupPayload = {
    name: string;
    description?: string;
};

export interface UserGroupFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "update";
    initialValues: UserGroupPayload;
    onSubmit: (values: UserGroupPayload) => void | Promise<void>;
}

export default function UserGroupForm({
    open,
    onOpenChange,
    mode,
    initialValues,
    onSubmit,
}: UserGroupFormProps) {
    return (
        <FormModal<UserGroupPayload>
            open={open}
            onOpenChange={onOpenChange}
            mode={mode}
            title={mode === "create" ? "Créer un groupe" : "Modifier le groupe"}
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
                            placeholder="Nom du groupe"
                        />
                    </div>
                    <div className="space-y-1">
                        <label className="text-sm font-medium">
                            Description
                        </label>
                        <textarea
                            className="flex h-24 w-full rounded-md border border-input bg-transparent px-3 py-2 text-sm shadow-sm focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring"
                            value={values.description ?? ""}
                            onChange={(e) =>
                                setValues({
                                    ...values,
                                    description: e.target.value,
                                })
                            }
                            placeholder="Description (optionnel)"
                        />
                    </div>
                </div>
            )}
        />
    );
}
