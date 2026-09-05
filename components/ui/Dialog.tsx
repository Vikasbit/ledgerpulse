// components/ui/Dialog.tsx
import React from "react";
import { Modal } from "./Modal";

interface DialogProps {
  open: boolean;
  onClose: () => void;
  title?: string;
  description?: string;
  children: React.ReactNode;
}

export const Dialog = ({ open, onClose, title, description, children }: DialogProps) => (
  <Modal open={open} onClose={onClose} title={title}>
    {description && <p className="mb-4 text-sm text-gray-600">{description}</p>}
    {children}
  </Modal>
);
