import { Button } from "@/Components/ui/button";
import { Calendar } from "@/Components/ui/calendar";
import { Label } from "@/Components/ui/label";
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from "@/Components/ui/popover";
import { cn } from "@/lib/utils";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { useState } from "react";

type FormDatePickerProps = {
    name: string;
    label?: string;
    value: Date | null;
    error?: string;
    onChange: (name: string, value: Date | null) => void;
};

export function FormDatePicker({
    name,
    label,
    value,
    error,
    onChange,
}: FormDatePickerProps) {
    const [open, setOpen] = useState(false);

    return (
        <div className="space-y-1">
            {label && <Label htmlFor={name}>{label}</Label>}

            <Popover open={open} onOpenChange={setOpen}>
                <PopoverTrigger asChild>
                    <Button variant="outline" className={cn( "w-full justify-start text-left font-normal",
                            !value && "text-muted-foreground", error && "border-red-500 focus-visible:ring-red-500" )}
                    >
                        <CalendarIcon className="mr-2 h-4 w-4" />
                        {value ? ( format(value, "dd/MM/yyyy") ) : ( <span>Sélectionner une date</span> )}
                    </Button>
                </PopoverTrigger>

                <PopoverContent align="start" className="p-0">
                    <Calendar mode="single" selected={value ?? undefined}
                        onSelect={(date) => {
                            onChange(name, date ?? null);
                            setOpen(false);
                        }}
                    />
                </PopoverContent>
            </Popover>

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
