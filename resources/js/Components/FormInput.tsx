// Components/FormInput.tsx
import { Input } from "@/Components/ui/input";
import { Label } from "@/Components/ui/label";
import { cn } from "@/lib/utils";
import type { InputHTMLAttributes } from "react";

type FormInputProps = {
    name: string;
    label?: string;
    value: string;
    error?: string;
    onChange: (name: string, value: string) => void;
} & Omit<InputHTMLAttributes<HTMLInputElement>, "onChange" | "name" | "value">;

export function FormInput({
    name,
    label,
    value,
    error,
    onChange,
    className,
    ...props
}: FormInputProps) {
    return (
        <div className="space-y-1">
            {label && <Label htmlFor={name}>{label}</Label>}
            <Input
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
