import { Select } from "antd";

interface FormDefaultSelectProps {
    name: string;
    label?: string;
    value?: any;
    options: { value: any; label: string }[];
    placeholder?: string;
    error?: string;
    onChange: (name: string, value: any) => void;
    disabled?: boolean;
    allowClear?: boolean;
    showSearch?: boolean;
    filterOption?: boolean | ((input: string, option: any) => boolean);
    className?: string;
}

export function FormDefaultSelect({
    name,
    label,
    value,
    options,
    placeholder = "Sélectionner...",
    error,
    onChange,
    disabled = false,
    allowClear = true,
    showSearch = false,
    filterOption = true,
    className = "",
}: FormDefaultSelectProps) {
    const handleChange = (selectedValue: any) => {
        onChange(name, selectedValue);
    };

    return (
        <div className="space-y-2">
            {label && (
                <label htmlFor={name} className="text-sm font-medium text-gray-800">
                    {label}
                </label>
            )}
            <Select
                id={name}
                value={value}
                onChange={handleChange}
                placeholder={placeholder}
                disabled={disabled}
                allowClear={allowClear}
                showSearch={showSearch}
                filterOption={filterOption}
                status={error ? "error" : undefined}
                className={`w-full ${className}`}
                size="large"
                options={options}
            />
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
