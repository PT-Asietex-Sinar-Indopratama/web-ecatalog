import type { Auth } from "@/types/auth";

declare module "react" {
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module "@inertiajs/core" {
    interface PageProps {
        name: string;
        auth: Auth;
        sidebarOpen: boolean;
        flash: {
            type: "success" | "error" | "warning" | "info";
            message: string;
        } | null;
    }
}