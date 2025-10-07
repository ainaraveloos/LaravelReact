import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { FileExcelOutlined } from "@ant-design/icons";
import { Button, Checkbox, Dropdown, MenuProps, Space, Spin } from "antd";
import { useEffect, useMemo, useState } from "react";

export type TableColumnOption = { header: string; field: string };

type ColumnPickerExportProps = {
    columns: TableColumnOption[];
    exportUrl: string;
    buttonText?: string;
};

export default function ColumnPickerExport({
    columns,
    exportUrl,
    buttonText = "Exporter",
}: ColumnPickerExportProps) {
    const [open, setOpen] = useState(false);
    const [loading, setLoading] = useState(false);
    const [selected, setSelected] = useState<string[]>([]);

    useEffect(() => {
        if (open && selected.length === 0 && columns.length > 0) {
            setSelected(columns.map((c) => c.field));
        }
    }, [open]);

    const allColumns = columns;

    const items = useMemo(() => {
        return [
            {
                key: "content",
                label: (
                    <div style={{ minWidth: 300, maxWidth: 360 }} onClick={(e) => e.stopPropagation()} onMouseDown={(e) => e.stopPropagation()} >
                        <div style={{ maxHeight: 300, overflowY: "auto" }} className="flex flex-col gap-2" >
                            {loading ?
                            ( <div className="flex items-center justify-center py-6"><Spin size="small"/></div> )
                            : (
                                allColumns.map((col) => (
                                    <Checkbox key={col.field} checked={selected.includes(col.field)}
                                        onChange={(e) => {
                                            const checked = e.target.checked;
                                            setSelected((prev) => checked ? Array.from( new Set([ ...prev,col.field])) : prev.filter((f) => f !== col.field));
                                        }}
                                    >
                                        {col.header}
                                    </Checkbox>
                                ))
                            )}
                        </div>
                        <div className="flex gap-2 pt-3">
                            <Button type="primary" icon={<FileExcelOutlined />} block disabled={selected.length === 0} onClick={() => doExport()}>
                                Exporter Excel
                            </Button>
                        </div>
                    </div>
                ),
            },
        ];
    }, [allColumns, loading, selected]);

    const menuConfig = useMemo(() => ({
            items,
            onClick: (info: any) => {
                if (info?.domEvent) {
                    info.domEvent.stopPropagation();
                    info.domEvent.preventDefault();
                }
            },
        }),
        [items]
    );

    const doExport = async () => {
        try {
            setLoading(true);
            const payload = { map: columns.filter((c) => selected.includes(c.field)).map((c) => ({ header: c.header, field: c.field }))};
            // Build query string for GET request to avoid CSRF issues
            const params = new URLSearchParams();
            (payload.map).forEach((m, idx) => {
                    params.append(`map[${idx}][header]`, m.header);
                    params.append(`map[${idx}][field]`, m.field);
                }
            );
            const url = `${exportUrl}?${params.toString()}`;
            // Laisse le backend gérer le téléchargement (en-têtes Content-Disposition)
            window.open(url, "_blank", "noopener,noreferrer");
            setOpen(false);
        } catch (e) { console.error(e);}
        finally { setLoading(false);}
    };

    return (
        <Dropdown menu={menuConfig} trigger={["click"]} open={open} onOpenChange={setOpen}>
            <Button size="large">
                <Space>
                    {buttonText}
                    <FontAwesomeIcon icon="download" />
                </Space>
            </Button>
        </Dropdown>
    );
}
