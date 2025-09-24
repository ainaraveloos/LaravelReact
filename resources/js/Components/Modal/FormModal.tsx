import { Button } from "@/Components/ui/button";
import { useState,useEffect } from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/Components/ui/dialog";
import type { FormModalProps } from "@/types/Modal";

const sizeToMaxWidthClass: Record< NonNullable<FormModalProps<any>["size"]>, string > = {
    sm: "sm:max-w-sm",
    md: "sm:max-w-md",
    lg: "sm:max-w-lg",
    xl: "sm:max-w-xl",
    "2xl": "sm:max-w-2xl",
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

    const effectiveSubmitLabel = submitLabel ?? (mode === "create" ? "Créer" : "Mettre à jour");
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent className={`${sizeToMaxWidthClass[size]}`}>
                {(title || description) && (
                    <DialogHeader>
                        {title && <DialogTitle>{title}</DialogTitle>}
                        {description && <DialogDescription>{description}</DialogDescription>}
                    </DialogHeader>
                )}

                {/* Contenu du Modal */}
                <div className="space-y-4">
                    {render({ values, setValues, mode })}
                </div>

                {/* Footer par defaut du modal */}
                <DialogFooter>
                    <Button variant="outline" onClick={() => onOpenChange(false)} disabled={submitting} >
                        {cancelLabel}
                    </Button>
                    <Button variant="default" onClick={handleSubmit} disabled={submitting}>
                        {submitting ? "Soumission ..." : effectiveSubmitLabel}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
