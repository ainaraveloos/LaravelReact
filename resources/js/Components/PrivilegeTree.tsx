import { Checkbox, Tree } from "antd";
import type { DataNode } from "antd/es/tree";

export type PrivilegeModule = {
    key: string;
    title: string;
    children?: PrivilegeModule[];
};

type Props = {
    privilegesDef: PrivilegeModule[];
    value: string[];
    onChange: (routes: string[]) => void;
};

const toTreeData = (items: PrivilegeModule[]): DataNode[] =>
    items.map(({ key, title, children }) => ({
        key,
        title,
        children: children ? toTreeData(children) : undefined,
    }));

const collectDescendantKeys = (node?: PrivilegeModule): string[] => {
    if (!node) return [];
    const stack = [...(node.children || [])];
    const keys: string[] = [node.key];
    while (stack.length) {
        const current = stack.pop() as PrivilegeModule;
        keys.push(current.key);
        if (current.children) stack.push(...current.children);
    }
    return Array.from(new Set(keys));
};

const collectDescendantKeysFromNodes = (
    nodes: PrivilegeModule[] = []
): string[] => {
    const keys: string[] = [];
    for (const n of nodes) {
        keys.push(n.key);
        if (n.children) keys.push(...collectDescendantKeys(n));
    }
    return Array.from(new Set(keys));
};

export default function PrivilegeTree({
    privilegesDef,
    value,
    onChange,
}: Props) {
    const selection = new Set(value);

    const isCheckedAll = (keys: string[]) => keys.length > 0 && keys.every((k) => selection.has(k));
    const isIndeterminate = (keys: string[]) => !isCheckedAll(keys) && keys.some((k) => selection.has(k));

    const toggleKeys = (keys: string[], checked: boolean) => {
        const next = new Set(selection);
        for (const k of keys) {
            if (checked) next.add(k);
            else next.delete(k);
        }
        onChange(Array.from(next));
    };

    return (
        <div className="space-y-4">
            {privilegesDef.map((module) => {
                const moduleDescKeys = collectDescendantKeysFromNodes( module.children || [] );
                const moduleChecked = isCheckedAll(moduleDescKeys);
                const modulePartial = isIndeterminate(moduleDescKeys);

                return (
                    <div key={module.key} className="rounded-lg border bg-white p-4 shadow-sm" >
                        <div className="flex items-center justify-between">
                            <div className="font-semibold text-gray-800"> {module.title} </div>
                            <Checkbox checked={moduleChecked} indeterminate={modulePartial}
                            onChange={(e) => toggleKeys(moduleDescKeys, e.target.checked) }
                            >
                                Tout
                            </Checkbox>
                        </div>

                        {(module.children?.length || 0) > 0 && (
                            <div className="mt-3 grid xl:grid-cols-3 lg:grid-cols-2 md:grid-cols-1 gap-4">
                                {(module.children || []).map((child) => {
                                    const childDescKeys = collectDescendantKeys(child);
                                    const childChecked = isCheckedAll(childDescKeys);
                                    const childPartial = isIndeterminate(childDescKeys);

                                    // Tree shows only grand-children of child
                                    const grandNodes = toTreeData( child.children || [] );
                                    const grandDescKeys = collectDescendantKeysFromNodes( child.children || [] );
                                    const childCheckedKeys = value.filter((k) => grandDescKeys.includes(k));

                                    return (
                                        <div key={child.key} className="rounded-lg border bg-white p-4" >
                                            <div className="flex items-start justify-between mb-3">
                                                <div>
                                                    <span className="text-base font-medium text-blue-500 block">
                                                        {child.title}
                                                    </span>
                                                </div>
                                                <div className="flex items-center">
                                                    <Checkbox checked={childChecked}
                                                        indeterminate={ childPartial }
                                                        onChange={(e) =>
                                                            toggleKeys( childDescKeys, e.target.checked )
                                                        }
                                                    />
                                                </div>
                                            </div>

                                            {grandNodes.length > 0 && (
                                                <div className="mt-3 rounded-lg border bg-gray-50 p-3">
                                                    <Tree
                                                        checkable
                                                        defaultExpandAll
                                                        selectable={false}
                                                        treeData={grandNodes}
                                                        checkedKeys={
                                                            childCheckedKeys
                                                        }
                                                        onCheck={(keys) => {
                                                            // Replace selection within this child's subtree with the provided keys
                                                            const next =
                                                                new Set(
                                                                    selection
                                                                );
                                                            for (const k of grandDescKeys)
                                                                next.delete(k);
                                                            for (const k of keys as string[])
                                                                next.add(k);
                                                            // Sync child checkbox depending on completeness
                                                            const allGrand =
                                                                grandDescKeys.every(
                                                                    (k) =>
                                                                        next.has(
                                                                            k
                                                                        )
                                                                );
                                                            if (allGrand)
                                                                next.add(
                                                                    child.key
                                                                );
                                                            else
                                                                next.delete(
                                                                    child.key
                                                                );
                                                            onChange(
                                                                Array.from(next)
                                                            );
                                                        }}
                                                    />
                                                </div>
                                            )}
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                );
            })}
        </div>
    );
}
