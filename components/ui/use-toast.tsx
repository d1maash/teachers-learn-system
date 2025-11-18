"use client";

import * as React from "react";
import {
  ToastProvider as RadixToastProvider,
  ToastViewport,
  Toast,
  ToastTitle,
  ToastDescription
} from "./toast";

type ToastMessage = {
  id: number;
  title: string;
  description?: string;
};

type ToastContextValue = {
  toast: (message: Omit<ToastMessage, "id">) => void;
};

const ToastContext = React.createContext<ToastContextValue | null>(null);

let counter = 0;

export function ToastNotificationsProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = React.useState<ToastMessage[]>([]);

  const dismiss = React.useCallback((id: number) => {
    setToasts((prev) => prev.filter((toast) => toast.id !== id));
  }, []);

  const toast = React.useCallback(
    (message: Omit<ToastMessage, "id">) => {
      const id = ++counter;
      setToasts((prev) => [...prev, { ...message, id }]);
      setTimeout(() => dismiss(id), 5000);
    },
    [dismiss]
  );

  return (
    <ToastContext.Provider value={{ toast }}>
      <RadixToastProvider swipeDirection="right">
        {children}
        {toasts.map((toastMessage) => (
          <Toast key={toastMessage.id} onOpenChange={() => dismiss(toastMessage.id)}>
            <ToastTitle>{toastMessage.title}</ToastTitle>
            {toastMessage.description && (
              <ToastDescription>{toastMessage.description}</ToastDescription>
            )}
          </Toast>
        ))}
        <ToastViewport />
      </RadixToastProvider>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = React.useContext(ToastContext);
  if (!context) {
    throw new Error("useToast должен использоваться внутри ToastNotificationsProvider");
  }
  return context;
}

