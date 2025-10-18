declare module "vaul" {
  import * as React from "react";

  export const Drawer: {
    Root: React.ComponentType<{
      children?: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }>;
    Trigger: React.ComponentType<{
      children?: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }>;
    Portal: React.ComponentType<{
      children?: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }>;
    Close: React.ComponentType<{
      children?: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }>;
    Overlay: React.ComponentType<{
      children?: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }>;
    Content: React.ComponentType<{
      children?: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }>;
    Title: React.ComponentType<{
      children?: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }>;
    Description: React.ComponentType<{
      children?: React.ReactNode;
      className?: string;
      [key: string]: unknown;
    }>;
  };

  export default Drawer;
}

declare module "sonner" {
  import * as React from "react";

  export type ToasterProps = {
    theme?: "light" | "dark" | "system" | string;
    className?: string;
    icons?: Record<string, React.ReactNode>;
    style?: React.CSSProperties;
    [key: string]: unknown;
  };

  export const Toaster: React.FC<ToasterProps>;

  type ToastFn = ((message: string, options?: Record<string, unknown>) => string | number) & {
    success: (message: string, options?: Record<string, unknown>) => string | number;
    error: (message: string, options?: Record<string, unknown>) => string | number;
    info?: (message: string, options?: Record<string, unknown>) => string | number;
    warning?: (message: string, options?: Record<string, unknown>) => string | number;
    dismiss?: (id?: string | number) => void;
  };

  export const toast: ToastFn;
  export default Toaster;
}
