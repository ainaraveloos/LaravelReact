import { DatePicker } from "antd";

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
    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={name} className="text-sm font-medium">
                    {label}
                </label>
            )}

            <DatePicker
                id={name}
                value={value ? (window as any).dayjs?.(value) : undefined}
                onChange={(_, dateStr) => {
                    // antd returns dayjs + string; we convert to Date|null from string
                    onChange(name, dateStr ? new Date(dateStr) : null);
                }}
                status={error ? "error" : ""}
                className="w-full"
                format="DD/MM/YYYY"
            />

            {error && <p className="text-sm text-red-500">{error}</p>}
        </div>
    );
}
