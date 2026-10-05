import type { Auth } from '@/types/auth';

declare module 'react' {
    // React's declaration requires this generic even though this augmentation does not use it.
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    interface InputHTMLAttributes<T> {
        passwordrules?: string;
    }
}

declare module '@inertiajs/core' {
    interface PageProps {
        name: string;
        auth: Auth;
        sidebarOpen: boolean;
        flash: {
            type: 'success' | 'error' | 'warning' | 'info';
            message: string;
            whatsapp_url?: string;
        } | null;
    }
}
