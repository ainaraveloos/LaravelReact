import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { faFilter, faRefresh } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Button, Input } from "antd";
import { ReactNode, useState } from "react";

type FilterBaseProps<TFilter extends Record<string, any>> = {
    value: TFilter;
    onChange: (next: TFilter) => void;
    onSearch: (filter: TFilter) => void;
    onReset: (filter: TFilter) => void;
    showBoxShadow?: boolean;
    showFilterButton?: boolean;
    renderFilters?: (args: {
        value: TFilter;
        onChange: (partial: Partial<TFilter>) => void;
        apply: () => void;
        close: () => void;
    }) => ReactNode;
    renderAdd?: () => ReactNode;
    renderImport?: () => ReactNode;
};

export default function FilterBase<TFilter extends Record<string, any>>({
    value,
    onChange,
    onSearch,
    onReset,
    showBoxShadow = true,
    showFilterButton = true,
    renderFilters,
    renderAdd,
    renderImport,
}: FilterBaseProps<TFilter>) {
    const [open, setOpen] = useState(false);

    const update = (partial: Partial<TFilter>) => {
        onChange({ ...value, ...partial });
    };

    const apply = () => {
        onSearch(value);
        setOpen(false);
    };

    const reset = () => {
        onReset(value);
        setOpen(false);
    };

    return (
        <div className={`bg-white p-4 rounded-t-md ${ showBoxShadow ? "shadow" : "" }`}>
            <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                <div className="flex items-center w-full flex-grow">
                    <Input
                        value={value?.search ?? ""}
                        size="large"
                        onChange={(e) => update({ search: e.target.value })}
                        placeholder="Rechercher..."
                        onKeyDown={(e) => { if (e.key === "Enter") onSearch(value);}}
                        className="w-full rounded-r-none border border-r-0 focus:z-10"
                    />
                    {/* Layouts pour les filtres supplémentaires */}
                    {renderFilters && (
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <Button type="default" size="large" className="rounded-none border-r-0 focus:z-10">
                                    <FontAwesomeIcon icon={faFilter} />
                                </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-96 p-4">
                                <div className="space-y-3">
                                    {renderFilters?.({ value, onChange: (p) => update(p), apply, close: () => setOpen(false)})}
                                    <div className="flex gap-2 pt-2">
                                        <Button type="primary" onClick={apply} className="flex-1" > Appliquer </Button>
                                        <Button type="default" onClick={() => setOpen(false)} className="flex-1" > Fermer </Button>
                                    </div>
                                </div>
                            </PopoverContent>
                        </Popover>
                    )}

                    <Button type="default" size="large" onClick={reset} className=" group rounded-none border-r-0 focus:z-10" >
                        <FontAwesomeIcon icon={faRefresh} className="group-hover:rotate-180 transition-transform duration-300" />
                    </Button>
                    <Button
                        type="default"
                        size="large"
                        onClick={() => onSearch(value)}
                        className={`rounded-l-none ${ renderImport ? "rounded-r-none" : ""}`}
                    >
                        Rechercher
                    </Button>
                    {renderImport?.()}
                </div>
                {/* button ou autre element children */}
                <div className="w-full sm:w-auto">
                    <div className="ml-4 w-full flex gap-2 items-center"> {renderAdd?.()}</div>
                </div>
            </div>
        </div>
    );
}
