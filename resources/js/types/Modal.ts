export type ModalMode = "create" | "update";

export interface FormModalProps<T extends object> {
    open: boolean;
    onOpenChange: (open: boolean) => void;
    mode: ModalMode;
    title?: string;
    description?: string;
    initialValues: T;
    onSubmit: (values: T) => void | Promise<void>;
    submitLabel?: string;
    cancelLabel?: string;
    size?: "sm" | "md" | "lg" | "xl" | "2xl"|"full_screen";
    /**
     * Render form fields. You receive values and a setter to update them.
     */
    render: (args: {
        values: T;
        setValues: (updater: T | ((prev: T) => T)) => void;
        mode: ModalMode;
    }) => React.ReactNode;
}
