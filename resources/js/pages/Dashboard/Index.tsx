import type { PageProps } from '@inertiajs/core';
import { usePage } from '@inertiajs/react';
import { AlertComponent } from '@/components/common/AlertComponent';
import DashboardLayout from '@/Layouts/DashboardLayout';

export default function Admin() {
    const { flash } = usePage<PageProps>().props;

    return (
        <DashboardLayout className="min-h-0! grid-cols-3 gap-4">
            {/* FLASH SECTION */}
            {flash && (
                <AlertComponent
                    title={flash.message}
                    variant={flash.type}
                    className="col-span-4 mb-4"
                />
            )}
            <span className="col-span-4 space-y-4">
                Welcome to the Admin Dashboard
            </span>

            <div className="col-span-1 h-14 rounded-md bg-gray-200 md:h-60"></div>
            <div className="col-span-1 h-14 rounded-md bg-gray-200 md:h-60"></div>
            <div className="col-span-1 h-14 rounded-md bg-gray-200 md:h-60"></div>
        </DashboardLayout>
    );
}
