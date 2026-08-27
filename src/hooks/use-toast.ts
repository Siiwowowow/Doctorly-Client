/* eslint-disable react-hooks/rules-of-hooks */
import { toast as sonnerToast } from "sonner";
import * as React from "react";

export type ToastProps = {
  title?: React.ReactNode;
  description?: React.ReactNode;
  variant?: "default" | "destructive" | "success" | (string & {});
  action?: React.ReactNode;
  duration?: number;
};

export function useToast() {
  function toast({ title, description, variant, duration }: ToastProps) {
    const options = {
      description,
      duration,
    };
    
    if (variant === "destructive") {
      sonnerToast.error(title, options);
    } else if (variant === "success") {
      sonnerToast.success(title, options);
    } else {
      sonnerToast(title, options);
    }
  }

  return { 
    toast,
    dismiss: sonnerToast.dismiss,
  };
}

export const toast = (props: ToastProps) => {
  const { toast: makeToast } = useToast();
  makeToast(props);
};
