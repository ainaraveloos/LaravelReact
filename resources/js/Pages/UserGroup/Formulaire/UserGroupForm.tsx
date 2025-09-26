import FormModal from "@/Components/Modal/FormModal";
import { Input } from "@/Components/ui/input";

export type UserGroupPayload = {
    name: string;
    description?: string;
    privileges: string[];
};

export interface UserGroupFormProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: "create" | "update";
    initialValues: UserGroupPayload;
    onSubmit: (values: UserGroupPayload) => void | Promise<void>;
    privilegesDef: any[];
}

export default function UserGroupForm({
    open,
    onOpenChange,
    mode,
    initialValues,
    onSubmit,
    privilegesDef,
}: UserGroupFormProps) {
    const modules = privilegesDef || [];

    const getAllModuleRoutes = (module: any): string[] => {
        const collect: string[] = [];
        if (Array.isArray(module.routes)) collect.push(...module.routes);
        if (Array.isArray(module.children)) {
            for (const child of module.children) {
                if (Array.isArray(child.routes)) collect.push(...child.routes);
                if (Array.isArray(child.children)) {
                    for (const grand of child.children) {
                        if (Array.isArray(grand.routes))
                            collect.push(...grand.routes);
                    }
                }
            }
        }
        return Array.from(new Set(collect));
    };

    const getAllChildRoutes = (child: any): string[] => {
        const collect: string[] = [];
        if (Array.isArray(child.routes)) collect.push(...child.routes);
        if (Array.isArray(child.children)) {
            for (const grand of child.children) {
                if (Array.isArray(grand.routes)) collect.push(...grand.routes);
            }
        }
        return Array.from(new Set(collect));
    };

    const isModuleFullyChecked = (values: UserGroupPayload, module: any) => {
        const all = getAllModuleRoutes(module);
        return (
            all.length > 0 && all.every((r) => values.privileges.includes(r))
        );
    };
    const isModulePartiallyChecked = (
        values: UserGroupPayload,
        module: any
    ) => {
        const all = getAllModuleRoutes(module);
        const some = all.some((r) => values.privileges.includes(r));
        return some && !all.every((r) => values.privileges.includes(r));
    };

    const isChildFullyChecked = (values: UserGroupPayload, child: any) => {
        const all = getAllChildRoutes(child);
        return (
            all.length > 0 && all.every((r) => values.privileges.includes(r))
        );
    };
    const isChildPartiallyChecked = (values: UserGroupPayload, child: any) => {
        const all = getAllChildRoutes(child);
        const some = all.some((r) => values.privileges.includes(r));
        return some && !all.every((r) => values.privileges.includes(r));
    };

    const toggleModule = (
        values: UserGroupPayload,
        setValues: (v: UserGroupPayload) => void,
        module: any,
        checked: boolean
    ) => {
        const all = getAllModuleRoutes(module);
        if (checked) {
            setValues({
                ...values,
                privileges: Array.from(
                    new Set([...(values.privileges || []), ...all])
                ),
            });
        } else {
            setValues({
                ...values,
                privileges: (values.privileges || []).filter(
                    (r) => !all.includes(r)
                ),
            });
        }
    };

    const toggleChild = (
        values: UserGroupPayload,
        setValues: (v: UserGroupPayload) => void,
        child: any,
        checked: boolean
    ) => {
        const all = getAllChildRoutes(child);
        if (checked) {
            setValues({
                ...values,
                privileges: Array.from(
                    new Set([...(values.privileges || []), ...all])
                ),
            });
        } else {
            setValues({
                ...values,
                privileges: (values.privileges || []).filter(
                    (r) => !all.includes(r)
                ),
            });
        }
    };

    return (
        <FormModal<UserGroupPayload>
            open={open}
            onOpenChange={onOpenChange}
            mode={mode}
            title={mode === "create" ? "Créer un groupe" : "Modifier le groupe"}
            initialValues={initialValues}
            onSubmit={onSubmit}
            render={({ values, setValues }) => (
                <div className="space-y-4">
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

                    {/* Privileges selector */}
                    <div className="space-y-4">
                        <div className="text-sm font-medium">Privilèges</div>
                        <div className="space-y-3">
                            {modules.map((mod: any) => (
                                <div
                                    key={mod.key}
                                    className="rounded-md border p-3 bg-gray-50"
                                >
                                    <div className="flex items-center justify-between">
                                        <div className="font-semibold text-gray-700">
                                            {mod.title}
                                        </div>
                                        <label className="flex items-center gap-2 text-sm">
                                            <input
                                                type="checkbox"
                                                checked={isModuleFullyChecked(
                                                    values,
                                                    mod
                                                )}
                                                ref={(el) => {
                                                    if (el)
                                                        el.indeterminate =
                                                            isModulePartiallyChecked(
                                                                values,
                                                                mod
                                                            );
                                                }}
                                                onChange={(e) =>
                                                    toggleModule(
                                                        values,
                                                        setValues,
                                                        mod,
                                                        e.currentTarget.checked
                                                    )
                                                }
                                            />
                                            <span>Tout</span>
                                        </label>
                                    </div>
                                    {Array.isArray(mod.children) &&
                                        mod.children.length > 0 && (
                                            <div className="mt-3 grid md:grid-cols-2 gap-3">
                                                {mod.children.map(
                                                    (child: any) => (
                                                        <div
                                                            key={child.key}
                                                            className="rounded border bg-white p-3"
                                                        >
                                                            <div className="flex items-center justify-between">
                                                                <div className="text-sm font-medium text-blue-600">
                                                                    {
                                                                        child.title
                                                                    }
                                                                </div>
                                                                <label className="flex items-center gap-2 text-sm">
                                                                    <input
                                                                        type="checkbox"
                                                                        checked={isChildFullyChecked(
                                                                            values,
                                                                            child
                                                                        )}
                                                                        ref={(
                                                                            el
                                                                        ) => {
                                                                            if (
                                                                                el
                                                                            )
                                                                                el.indeterminate =
                                                                                    isChildPartiallyChecked(
                                                                                        values,
                                                                                        child
                                                                                    );
                                                                        }}
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            toggleChild(
                                                                                values,
                                                                                setValues,
                                                                                child,
                                                                                e
                                                                                    .currentTarget
                                                                                    .checked
                                                                            )
                                                                        }
                                                                    />
                                                                    <span>
                                                                        Tout
                                                                    </span>
                                                                </label>
                                                            </div>
                                                            {Array.isArray(
                                                                child.routes
                                                            ) &&
                                                                child.routes
                                                                    .length >
                                                                    0 && (
                                                                    <div className="mt-2 grid grid-cols-1 gap-1">
                                                                        {child.routes.map(
                                                                            (
                                                                                routeKey: string
                                                                            ) => (
                                                                                <label
                                                                                    key={
                                                                                        routeKey
                                                                                    }
                                                                                    className="flex items-center gap-2 text-xs text-gray-700"
                                                                                >
                                                                                    <input
                                                                                        type="checkbox"
                                                                                        checked={(
                                                                                            values.privileges ||
                                                                                            []
                                                                                        ).includes(
                                                                                            routeKey
                                                                                        )}
                                                                                        onChange={(
                                                                                            e
                                                                                        ) => {
                                                                                            const checked =
                                                                                                e
                                                                                                    .currentTarget
                                                                                                    .checked;
                                                                                            if (
                                                                                                checked
                                                                                            ) {
                                                                                                setValues(
                                                                                                    {
                                                                                                        ...values,
                                                                                                        privileges:
                                                                                                            Array.from(
                                                                                                                new Set(
                                                                                                                    [
                                                                                                                        ...(values.privileges ||
                                                                                                                            []),
                                                                                                                        routeKey,
                                                                                                                    ]
                                                                                                                )
                                                                                                            ),
                                                                                                    }
                                                                                                );
                                                                                            } else {
                                                                                                setValues(
                                                                                                    {
                                                                                                        ...values,
                                                                                                        privileges:
                                                                                                            (
                                                                                                                values.privileges ||
                                                                                                                []
                                                                                                            ).filter(
                                                                                                                (
                                                                                                                    r
                                                                                                                ) =>
                                                                                                                    r !==
                                                                                                                    routeKey
                                                                                                            ),
                                                                                                    }
                                                                                                );
                                                                                            }
                                                                                        }}
                                                                                    />
                                                                                    <span>
                                                                                        {
                                                                                            routeKey
                                                                                        }
                                                                                    </span>
                                                                                </label>
                                                                            )
                                                                        )}
                                                                    </div>
                                                                )}
                                                        </div>
                                                    )
                                                )}
                                            </div>
                                        )}
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            )}
        />
    );
}
