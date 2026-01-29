import * as React from "react"
import { cn } from "../../lib/utils"
import { X } from "lucide-react"
import { Button } from "./button"

const Modal = ({ isOpen, onClose, title, children, footer, size = "default" }) => {
    if (!isOpen) return null

    const sizes = {
        sm: "max-w-md",
        default: "max-w-lg",
        lg: "max-w-2xl",
        xl: "max-w-4xl",
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 animate-fade-in">
            {/* Overlay */}
            <div
                className="absolute inset-0 modal-overlay"
                onClick={onClose}
            />

            {/* Modal */}
            <div className={cn(
                "relative bg-card rounded-lg shadow-corporate-lg w-full animate-slide-down",
                sizes[size]
            )}>
                {/* Header */}
                <div className="flex items-center justify-between p-6 border-b border-white/5 bg-secondary/20">
                    <h2 className="text-xl font-bold text-white tracking-tight">{title}</h2>
                    <button
                        onClick={onClose}
                        className="text-muted-foreground hover:text-foreground transition-corporate"
                    >
                        <X className="h-5 w-5" />
                    </button>
                </div>

                {/* Content */}
                <div className="p-6">
                    {children}
                </div>

                {/* Footer */}
                {footer && (
                    <div className="flex items-center justify-end gap-3 p-6 border-t border-border bg-muted/30">
                        {footer}
                    </div>
                )}
            </div>
        </div>
    )
}

const ConfirmModal = ({ isOpen, onClose, onConfirm, title, message, confirmText = "Confirmar", cancelText = "Cancelar", variant = "default" }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <>
                    <Button variant="outline" onClick={onClose}>
                        {cancelText}
                    </Button>
                    <Button
                        variant={variant === "destructive" ? "destructive" : "default"}
                        onClick={() => {
                            onConfirm()
                            onClose()
                        }}
                    >
                        {confirmText}
                    </Button>
                </>
            }
        >
            <p className="text-foreground">{message}</p>
        </Modal>
    )
}

const AlertModal = ({ isOpen, onClose, title, message }) => {
    return (
        <Modal
            isOpen={isOpen}
            onClose={onClose}
            title={title}
            footer={
                <Button onClick={onClose}>
                    Aceptar
                </Button>
            }
        >
            <p className="text-foreground">{message}</p>
        </Modal>
    )
}

export { Modal, ConfirmModal, AlertModal }
