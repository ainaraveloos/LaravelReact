import { Button } from "@/Components/ui/button";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/Components/ui/dropdown-menu";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/Components/ui/table";
import usePermissions from "@/hooks/usePermissions";
import type { Action, DataTableProps } from "@/types/DataTable";
import { router } from "@inertiajs/react";
import { MoreHorizontal } from "lucide-react";

export function DataTable<T extends { id: number | string }>({
    data,
    columns,
    actions = [],
    filters = {},
    endpoint,
}: DataTableProps<T>) {
    const { can } = usePermissions();
    const startIndex = (data.current_page - 1) * data.per_page;

    const handlePageChange = (pageNum: number) => {
        router.get( endpoint,{ page: pageNum, ...filters },{ preserveState: true, preserveScroll: true });
    };

    const isActionVisible = (action: Action<T>, row: T) => {
        const privilegeKey = typeof action.privilege === "function" ? action.privilege() : action.privilege;
        const privilegeCheck = privilegeKey ? can(privilegeKey) : true;
        if (action.visible !== undefined) return privilegeCheck && action.visible(row);
        return privilegeCheck;
    };

    const isActionDisabled = (action: Action<T>, row: T) => { return action.disabled ? action.disabled(row) : false };

    return (
        <div className="space-y-6">
            <div className="rounded-lg border bg-white shadow-sm">
                <Table>
                    <TableHeader>
                        <TableRow className="hover:bg-transparent">
                            {columns.map((col) => (
                                <TableHead key={col.key as string} className="font-medium text-gray-700" >
                                    {col.label}
                                </TableHead>
                            ))}
                            {actions.length > 0 && (
                                <TableHead className="text-right"> Actions </TableHead>
                            )}
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {data.data.length > 0 ? (
                            data.data.map((row, idx) => (
                                <TableRow key={row.id} className={"hover:bg-blue-50 transition " + (idx % 2 === 1 ? 'bg-gray-50' : '')} >
                                    {columns.map((col) => col.key === "index" ? (
                                        <TableCell key={`index-${row.id}`} className="text-gray-600" >
                                            {startIndex + idx + 1}
                                        </TableCell>
                                    ) : (
                                        <TableCell key={col.key as string} className="text-gray-700" >
                                            {col.render ? col.render(row, idx) : String( row[ col.key as keyof T ] ?? "" )}
                                        </TableCell>
                                        )
                                    )}

                                    {actions.length > 0 && actions.some(action => isActionVisible(action, row)) && (
                                    <TableCell className="text-right">
                                        <DropdownMenu>
                                            <DropdownMenuTrigger asChild>
                                                <Button variant="ghost" size="icon" className="hover:bg-gray-100" >
                                                    <MoreHorizontal className="w-4 h-4 text-gray-600" />
                                                </Button>
                                            </DropdownMenuTrigger>
                                            <DropdownMenuContent align="end">
                                                {actions.map((action, i) => {
                                                    if ( !isActionVisible(action,row) ) return null;
                                                        return (
                                                            <DropdownMenuItem key={i} onClick={() => action.onClick(row)}
                                                            disabled={isActionDisabled(action,row)}
                                                            >
                                                                { action.label }
                                                            </DropdownMenuItem>
                                                            );
                                                })}
                                            </DropdownMenuContent>
                                        </DropdownMenu>
                                    </TableCell>
                                )}
                            </TableRow>
                        ))) : (
                            <TableRow>
                                <TableCell colSpan={ columns.length + (actions.length > 0 ? 1 : 0) } className="text-center text-gray-400 py-6" >
                                    Aucune donnée trouvée
                                </TableCell>
                            </TableRow>
                        )}

                        {/* Pagination footer */}
                        <TableRow>
                            <TableCell colSpan={ columns.length + (actions.length > 0 ? 1 : 0) } className="bg-white px-4 py-3" >
                                <div className="flex items-center justify-between text-sm text-gray-600">
                                    <span>
                                        Page{" "}
                                        <span className="font-medium text-gray-800"> {data.current_page} </span>
                                        {" "} sur {data.last_page} —{" "}
                                        <span className="font-medium"> {data.total} </span>
                                        {" "} enregistrements
                                    </span>
                                    <div className="flex gap-2">
                                        <Button variant="outline" size="sm" disabled={data.current_page === 1}
                                            onClick={() => handlePageChange( data.current_page - 1 )}
                                        >
                                            Précédent
                                        </Button>
                                        <Button variant="outline" size="sm" disabled={ data.current_page === data.last_page }
                                            onClick={() => handlePageChange( data.current_page + 1 )}
                                        >
                                            Suivant
                                        </Button>
                                    </div>
                                </div>
                            </TableCell>
                        </TableRow>
                    </TableBody>
                </Table>
            </div>
        </div>
    );
}
