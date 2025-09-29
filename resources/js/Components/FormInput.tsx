// Components/FormInput.tsx (Ant Design)
import { EyeInvisibleOutlined, EyeTwoTone } from "@ant-design/icons";
import { Input } from "antd";
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
    const isPassword = props.type === "password";
    return (
        <div className="space-y-1">
            {label && (
                <label htmlFor={name} className="text-sm font-medium">
                    {label}
                </label>
            )}
            {isPassword ? (
                <Input.Password
                    id={name}
                    size="large"
                    value={value}
                    status={error ? "error" : undefined}
                    onChange={(e) => onChange(name, e.target.value)}
                    className={`w-full ${className ?? ""}`}
                    iconRender={(visible) =>
                        visible ? <EyeTwoTone /> : <EyeInvisibleOutlined />
                    }
                    {...(props as any)}
                />
            ) : (
                <Input
                    id={name}
                    value={value}
                    status={error ? "error" : undefined}
                    onChange={(e) => onChange(name, e.target.value)}
                    className={`w-full ${className ?? ""}`}
                    {...props}
                />
            )}
            {error && <p className="text-xs text-red-500">{error}</p>}
        </div>
    );
}
