import { Label } from "@/Components/ui/label";
import { Textarea } from "@/Components/ui/textarea";
import { cn } from "@/lib/utils";
import type { TextareaHTMLAttributes } from "react";

type FormTextareaProps = {
    name: string;
    label?: string;
    value: string;
    error?: string;
    onChange: (name: string, value: string) => void;
} & Omit<
    TextareaHTMLAttributes<HTMLTextAreaElement>,
    "onChange" | "name" | "value"
>;

export function FormTextarea({
    name,
    label,
    value,
    error,
    onChange,
    className,
    ...props
}: FormTextareaProps) {
    return (
        <div className="space-y-1">
            {label && <Label htmlFor={name}>{label}</Label>}

            <Textarea
                id={name}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                className={cn(
                    error && "border-red-500 focus-visible:ring-red-500",
                    className
                )}
                {...props}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
