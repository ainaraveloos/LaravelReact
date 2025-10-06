import usePermissions from "@/hooks/usePermissions";
import type { Action, DataTableProps } from "@/types/DataTable";
import { MoreOutlined } from "@ant-design/icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { router } from "@inertiajs/react";
import { Button, Dropdown, Menu, Table } from "antd";

export function DataTable<T extends { id: number | string }>({
    data,
    columns,
    actions = [],
    filters = {},
    endpoint,
    actionOnDropdown = true,
    selectableRows = false,
    selectedIds = [],
    onSelectionChange,
}: DataTableProps<T>) {
    const { can } = usePermissions();
    const startIndex = (data.current_page - 1) * data.per_page;

    const handlePageChange = (pageNum: number) => {
        router.get(
            endpoint,
            { page: pageNum, ...filters },
            { preserveState: true, preserveScroll: true }
        );
    };

    const isActionVisible = (action: Action<T>, row: T) => {
        const privilegeKey = typeof action.privilege === "function" ? action.privilege() : action.privilege;
        const privilegeCheck = privilegeKey ? can(privilegeKey) : true;
        if (action.visible !== undefined) return privilegeCheck && action.visible(row);
        return privilegeCheck;
    };

    const isActionDisabled = (action: Action<T>, row: T) => {
        return action.disabled ? action.disabled(row) : false;
    };

    // Build antd columns
    const antdColumns = [
        ...columns.map((col) => {
            const colAlign = (col).align ?? "left";
            const colWidth = (col).width ?? 60;
            if (col.key === "index") {
                return {
                    title: col.label,
                    dataIndex: "_index",
                    key: "_index",
                    width: colWidth,
                    align: colAlign,
                    render: (_: any, __: any, idx: number) => startIndex + idx + 1,
                };
            }
            return {
                title: col.label,
                dataIndex: col.key,
                key: col.key,
                align: colAlign,
                render: (_: any, record: T, idx: number) => col.render ? col.render(record, idx) : String((record as any)[col.key] ?? ""),
            };
        }),

        ...(actions.length > 0
            ? [
                {
                    title: "Actions",
                    key: "actions",
                    fixed: "right",
                    allign:"center",
                    width: actionOnDropdown ? 80 : 100,
                    render: (_: any, record: T) => {
                        const visibleActions = actions.filter((a) => isActionVisible(a, record));
                        if (visibleActions.length === 0) return null;
                        if (actionOnDropdown) {
                        const menu = (
                            <Menu
                                items={visibleActions.map((a, i) => ({
                                    key: i,
                                    disabled: isActionDisabled(a, record),
                                    label: (
                                        <span onClick={() => a.onClick(record)} className={`text-gray-600 ${a.classStyle ?? ""}`}>
                                            {a.icon && ( <FontAwesomeIcon className='mr-2' icon={a.icon}></FontAwesomeIcon> )}
                                            {a.label}
                                        </span>
                                    ),
                                }))}
                            />
                        );
                        return (
                            <Dropdown overlay={menu} trigger={["click"]} className="!text-center">
                                <Button size="small" icon={<MoreOutlined />} className="flex !items-center !justify-center"/>
                            </Dropdown>
                        );
                        }
                        return (
                            <div className="flex gap-2">
                                {visibleActions.map((a) => (
                                    <span onClick={() => a.onClick(record)} className={`text-gray-600 ${a.classStyle ?? ""} hover:text-gray-900`}>
                                        {a.icon && ( <FontAwesomeIcon icon={a.icon}></FontAwesomeIcon> )}
                                    </span>
                                ))}
                            </div>
                        )
                    },
                },
            ] : []),
    ];

    const rowSelection = selectableRows
        ? {selectedRowKeys: selectedIds as (string | number)[],onChange: (keys: any[]) => onSelectionChange && onSelectionChange(keys)} : undefined;

    return (
        <div className="space-y-6">
            <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
                <Table
                    dataSource={data.data}
                    columns={antdColumns as any}
                    rowKey={(r) => r.id}
                    pagination={false}
                    sticky
                    scroll={{ x:'max-content'}}
                    rowSelection={rowSelection as any}
                    className="custom-table"
                />
                {/* Pagination */}
                <div className="bg-white px-4 py-3 border-t">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                            Page{" "}
                            <span className="font-medium text-gray-800">
                                {" "}
                                {data.current_page}{" "}
                            </span>{" "}
                            sur {data.last_page} — {" "}
                            <span className="font-medium">{data.total}</span>{" "}
                            enregistrements
                        </span>
                        <div className="flex gap-2 items-center">
                            <Button disabled={data.current_page === 1} onClick={() => handlePageChange(data.current_page - 1)}>
                                Précédent
                            </Button>

                            {(() => {
                                const currentPage = data.current_page;
                                const lastPage = data.last_page;
                                const pages: (number | string)[] = [];
                                if (lastPage <= 7) { for (let i = 1; i <= lastPage; i++) pages.push(i)}
                                else {
                                    pages.push(1);
                                    if (currentPage > 3) pages.push('...');
                                    const start = Math.max(2, currentPage - 1);
                                    const end = Math.min(lastPage - 1, currentPage + 1);
                                    for (let i = start; i <= end; i++) pages.push(i);
                                    if (currentPage < lastPage - 2) pages.push('...');
                                    pages.push(lastPage);
                                }
                                return pages.map((page, idx) =>
                                    typeof page === 'number' ? (
                                        <Button key={page} type={page === currentPage ? 'primary' : 'default'} onClick={() => handlePageChange(page)} size="middle">
                                            {page}
                                        </Button>
                                    ) : ( <span key={`ellipsis-${idx}`} className="px-2">...</span>)
                                );
                            })()}

                            <Button disabled={data.current_page === data.last_page} onClick={() => handlePageChange(data.current_page + 1)}>
                                Suivant
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
