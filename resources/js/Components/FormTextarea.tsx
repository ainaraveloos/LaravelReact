import { Input } from "antd";
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
            {label && (
                <label htmlFor={name} className="text-sm font-medium">
                    {label}
                </label>
            )}

            <Input.TextArea
                id={name}
                value={value}
                onChange={(e) => onChange(name, e.target.value)}
                status={error ? "error" : ""}
                className={className}
                {...(props as any)}
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
