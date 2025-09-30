import usePermissions from "@/hooks/usePermissions";
import type { Action, DataTableProps } from "@/types/DataTable";
import { MoreOutlined } from "@ant-design/icons";
import { router } from "@inertiajs/react";
import { Button, Dropdown, Menu, Table } from "antd";
import type { ColumnsType } from "antd/es/table";

export function DataTable<T extends { id: number | string }>({
    data,
    columns,
    actions = [],
    filters = {},
    endpoint,
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
        const privilegeKey =
            typeof action.privilege === "function"
                ? action.privilege()
                : action.privilege;
        const privilegeCheck = privilegeKey ? can(privilegeKey) : true;
        if (action.visible !== undefined)
            return privilegeCheck && action.visible(row);
        return privilegeCheck;
    };

    const isActionDisabled = (action: Action<T>, row: T) => {
        return action.disabled ? action.disabled(row) : false;
    };

    // Build antd columns
    const antdColumns: ColumnsType<T & { _index?: number }> = [
        ...columns.map((col) => {
            if (col.key === "index") {
                return {
                    title: col.label,
                    dataIndex: "_index",
                    key: "_index",
                    width: 60,
                    render: (_: any, __: any, idx: number) =>
                        startIndex + idx + 1,
                } as any;
            }
            return {
                title: col.label,
                dataIndex: col.key as string,
                key: String(col.key),
                render: (_: any, record: T, idx: number) =>
                    col.render
                        ? col.render(record, idx)
                        : String((record as any)[col.key as string] ?? ""),
            } as any;
        }),
        ...(actions.length > 0
            ? [
                  {
                      title: "Actions",
                      key: "actions",
                      fixed: "right" as const,
                      width: 96,
                      render: (_: any, record: T) => {
                          const visibleActions = actions.filter((a) =>
                              isActionVisible(a, record)
                          );
                          if (visibleActions.length === 0) return null;
                          const menu = (
                              <Menu
                                  items={visibleActions.map((a, i) => ({
                                      key: i,
                                      disabled: isActionDisabled(a, record),
                                      label: (
                                          <span
                                              onClick={() => a.onClick(record)}
                                          >
                                              {" "}
                                              {a.label}
                                          </span>
                                      ),
                                  }))}
                              />
                          );
                          return (
                              <Dropdown overlay={menu} trigger={["click"]}>
                                  <Button
                                      size="small"
                                      icon={<MoreOutlined />}
                                      className="flex items-center justify-center"
                                  />
                              </Dropdown>
                          );
                      },
                  },
              ]
            : []),
    ];

    const rowSelection = selectableRows
        ? {
              selectedRowKeys: selectedIds as (string | number)[],
              onChange: (keys: any[]) =>
                  onSelectionChange &&
                  onSelectionChange(keys as (string | number)[]),
          }
        : undefined;

    return (
        <div className="space-y-6">
            <div className="rounded-lg border bg-white shadow-sm overflow-x-auto">
                <Table
                    dataSource={data.data as any[]}
                    columns={antdColumns as any}
                    rowKey={(r) => String((r as any).id)}
                    pagination={false}
                    sticky
                    scroll={{ x: 640 }}
                    rowSelection={rowSelection as any}
                    className="custom-table"
                />

                <div className="bg-white px-4 py-3 border-t">
                    <div className="flex items-center justify-between text-sm text-gray-600">
                        <span>
                            Page{" "}
                            <span className="font-medium text-gray-800">
                                {" "}
                                {data.current_page}{" "}
                            </span>{" "}
                            sur {data.last_page} —{" "}
                            <span className="font-medium">{data.total}</span>{" "}
                            enregistrements
                        </span>
                        <div className="flex gap-2">
                            <Button
                                disabled={data.current_page === 1}
                                onClick={() =>
                                    handlePageChange(data.current_page - 1)
                                }
                            >
                                Précédent
                            </Button>
                            <Button
                                disabled={data.current_page === data.last_page}
                                onClick={() =>
                                    handlePageChange(data.current_page + 1)
                                }
                            >
                                Suivant
                            </Button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
