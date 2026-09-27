import { createInertiaApp } from '@inertiajs/react';
import type { ResolvedComponent } from '@inertiajs/react';
import { resolvePageComponent } from 'laravel-vite-plugin/inertia-helpers';
import { createRoot } from 'react-dom/client';
import { route } from 'ziggy-js';

const appName = import.meta.env.VITE_APP_NAME || 'E-Catalog';
const pages = import.meta.glob<{ default: ResolvedComponent }>(
    './pages/**/*.tsx',
);

// daftarkan route() supaya bisa dipanggil global tanpa import manual
declare global {
    interface Window {
        route: typeof route;
    }
}
window.route = route;

createInertiaApp({
    title: (title) => (title ? `${title} - ${appName}` : appName),
    resolve: (name) =>
        resolvePageComponent(`./pages/${name}.tsx`, pages).then(
            (page) => page.default,
        ),
    setup({ el, App, props }) {
        createRoot(el).render(<App {...props} />);
    },
    progress: {
        color: '#4B5563',
    },
});
