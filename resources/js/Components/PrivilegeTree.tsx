import { Checkbox, Input, Tree } from "antd";
import type { DataNode } from "antd/es/tree";
import { useState } from "react";

export type PrivilegeModule = { key: string, title: string, children?: PrivilegeModule[]};

type Props = { privilegesDef: PrivilegeModule[], value: string[], onChange: (routes: string[]) => void };

const toTreeData = (items: PrivilegeModule[]): DataNode[] => items.map(({ key, title, children }) =>
({ key, title, children: children ? toTreeData(children) : undefined }));

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

const filterPrivileges = (
    modules: PrivilegeModule[],
    searchTerm: string
): PrivilegeModule[] => {
    if (!searchTerm.trim()) return modules;
    const term = searchTerm.toLowerCase();
    const filterNode = (node: PrivilegeModule): PrivilegeModule | null => {
        const matchesTitle = node.title.toLowerCase().includes(term);
        if (matchesTitle) { return node}
        const filteredChildren = node.children ?.map(filterNode).filter((child): child is PrivilegeModule => child !== null);
        if (filteredChildren && filteredChildren.length > 0) { return { ...node, children: filteredChildren } }
        return null;
    };
    return modules.map(filterNode).filter((module): module is PrivilegeModule => module !== null);
};

export default function PrivilegeTree({ privilegesDef, value, onChange }: Props) {
    const [searchTerm, setSearchTerm] = useState("");
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

    const filteredPrivileges = filterPrivileges(privilegesDef, searchTerm);

    return (
        <div className="space-y-6">
            <Input placeholder="Rechercher un module ou privilège..." allowClear size="large" value={searchTerm} className="mb-4"
                onChange={(e) => setSearchTerm(e.target.value)}
            />
            {filteredPrivileges.map((module) => {
                const moduleDescKeys = collectDescendantKeysFromNodes( module.children || [] );
                const moduleChecked = isCheckedAll(moduleDescKeys);
                const modulePartial = isIndeterminate(moduleDescKeys);

                return (
                    <div key={module.key} className="rounded-md border border-gray-200 bg-gradient-to-br from-white to-gray-50 shadow-md  transition-shadow duration-300" >
                        <div className="flex items-center justify-between p-5 border-b border-gray-200 bg-white/80 rounded-t-mdl">
                            <div className="flex items-center gap-3">
                                <div className="w-1.5 h-8 bg-gradient-to-b from-blue-400 to-blue-500 rounded-full"></div>
                                <h3 className="text-lg font-semibold text-blue-600">{module.title}</h3>
                            </div>
                            <Checkbox checked={moduleChecked} indeterminate={modulePartial} className="font-medium"
                                onChange={(e) => toggleKeys(moduleDescKeys, e.target.checked)}
                            >
                                Tout sélectionner
                            </Checkbox>
                        </div>

                        {(module.children?.length || 0) > 0 && (
                            <div className="p-5 grid xl:grid-cols-3 lg:grid-cols-2 grid-cols-1 gap-4">
                                {(module.children || []).map((child) => {
                                    const childDescKeys = collectDescendantKeys(child);
                                    const childChecked = isCheckedAll(childDescKeys);
                                    const childPartial = isIndeterminate(childDescKeys);

                                    const grandNodes = toTreeData( child.children || [] );
                                    const grandDescKeys = collectDescendantKeysFromNodes( child.children || [] );
                                    const childCheckedKeys = value.filter((k) => grandDescKeys.includes(k));

                                    return (
                                        <div key={child.key} className="rounded-lg border border-gray-200 bg-white shadow-sm hover:shadow-md hover:border-blue-300 transition-all duration-200" >
                                            <div className="flex items-center justify-between p-4 bg-gradient-to-r from-blue-50 to-indigo-50 border-b border-gray-200">
                                                <span className="text-sm font-semibold text-gray-500"> {child.title} </span>
                                                <Checkbox checked={childChecked} indeterminate={childPartial}
                                                    onChange={(e) => toggleKeys( childDescKeys, e.target.checked ) }
                                                />
                                            </div>

                                            {grandNodes.length > 0 && (
                                                <div className="p-3 bg-gray-50/50">
                                                    <Tree
                                                        checkable
                                                        defaultExpandAll
                                                        selectable={false}
                                                        treeData={grandNodes}
                                                        checkedKeys={childCheckedKeys}
                                                        className="privilege-tree"
                                                        onCheck={(keys) => {
                                                            const next = new Set(selection);
                                                            for (const k of grandDescKeys) next.delete(k);
                                                            for (const k of keys as string[]) next.add(k);
                                                            const allGrand = grandDescKeys.every((k) => next.has(k));
                                                            if (allGrand) next.add(child.key);
                                                            else next.delete(child.key);
                                                            onChange(Array.from(next));
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
