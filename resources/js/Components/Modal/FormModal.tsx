import type { FormModalProps } from "@/types/Modal";
import { Modal } from "antd";
import { useEffect, useState } from "react";

const sizeToWidth: Record<
    NonNullable<FormModalProps<any>["size"]> | "large" | "full_screen",
    number | string
> = {
    // Match Vue sample defaults and keep backward compatibility
    sm: 600,
    md: 800,
    lg: 1000,
    xl: 720,
    "2xl": 880,
    large: 1000, // alias to lg
    full_screen: "100%",
};

export default function FormModal<T extends object>({
    open,
    onOpenChange,
    mode,
    title,
    description,
    initialValues,
    onSubmit,
    submitLabel,
    cancelLabel = "Annuler",
    size = "lg",
    render,
}: FormModalProps<T>) {
    const [values, setValues] = useState<T>(initialValues);
    const [submitting, setSubmitting] = useState(false);

    useEffect(() => {
        if (open) setValues(initialValues);
    }, [open, initialValues]);

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            await onSubmit(values);
            onOpenChange(false);
        } finally {
            setSubmitting(false);
        }
    };

    const effectiveSubmitLabel =
        submitLabel ?? (mode === "create" ? "Créer" : "Mettre à jour");

    // Normalize size, support alias 'large' and special 'full_screen'
    const normalizedSize = (
        size === ("large" as any) ? ("lg" as any) : size
    ) as keyof typeof sizeToWidth;
    const modalWidth =
        sizeToWidth[size as keyof typeof sizeToWidth] ??
        sizeToWidth[normalizedSize] ??
        1000;
    const isFullscreen = size === ("full_screen" as any);

    return (
        <Modal
            open={open}
            onCancel={() => onOpenChange(false)}
            title={title}
            okText={effectiveSubmitLabel}
            cancelText={cancelLabel}
            onOk={handleSubmit}
            confirmLoading={submitting}
            width={modalWidth}
            style={
                isFullscreen
                    ? { top: 0, paddingBottom: 0, margin: 0 }
                    : undefined
            }
            bodyStyle={
                isFullscreen
                    ? { height: "calc(100vh - 120px)", overflow: "auto" }
                    : undefined
            }
            wrapClassName={isFullscreen ? "full-modal" : undefined}
            maskClosable={!submitting}
            destroyOnClose
        >
            {description && (
                <div className="text-sm text-gray-500 mb-3">{description}</div>
            )}
            <div className="space-y-4">
                {render({ values, setValues, mode })}
            </div>
        </Modal>
    );
}
