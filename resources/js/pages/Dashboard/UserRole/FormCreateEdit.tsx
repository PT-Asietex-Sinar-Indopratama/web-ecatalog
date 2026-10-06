import { useForm } from '@inertiajs/react';
import { Save } from 'lucide-react';
import { useEffect } from 'react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import type { PermissionItem, Role } from './Columns';

interface Props {
    role?: Role;
    allPermissions?: PermissionItem[];
    onCancel?: () => void;
    onSuccess?: () => void;
}

export function UserRoleForm({
    role,
    allPermissions = [],
    onCancel,
    onSuccess,
}: Props) {
    const isEdit = !!role;

    const { data, setData, post, put, processing, errors } = useForm<{
        name: string;
        permissions: string[];
    }>({
        name: role?.name ?? '',
        permissions: role?.permissions
            ? role.permissions.map((p) => p.name)
            : [],
    });

    useEffect(() => {
        setData({
            name: role?.name ?? '',
            permissions: role?.permissions
                ? role.permissions.map((p) => p.name)
                : [],
        });
    }, [role, setData]);

    const groupPermissions = (perms: PermissionItem[]) => {
        const groups: Record<string, PermissionItem[]> = {};
        perms.forEach((perm) => {
            const parts = perm.name.split(' ');
            const groupName =
                parts.length > 1 ? parts[1].toUpperCase() : 'GENERAL';

            if (!groups[groupName]) {
                groups[groupName] = [];
            }

            groups[groupName].push(perm);
        });

        return groups;
    };

    const grouped = groupPermissions(allPermissions);

    const togglePermission = (permName: string) => {
        if (data.permissions.includes(permName)) {
            setData(
                'permissions',
                data.permissions.filter((name) => name !== permName),
            );
        } else {
            setData('permissions', [...data.permissions, permName]);
        }
    };

    const toggleGroup = (groupPerms: PermissionItem[]) => {
        const groupNames = groupPerms.map((p) => p.name);
        const allChecked = groupNames.every((name) =>
            data.permissions.includes(name),
        );

        if (allChecked) {
            setData(
                'permissions',
                data.permissions.filter((name) => !groupNames.includes(name)),
            );
        } else {
            const newPermissions = Array.from(
                new Set([...data.permissions, ...groupNames]),
            );
            setData('permissions', newPermissions);
        }
    };

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('dashboard.user-role.update', role.id), {
                preserveScroll: true,
                onSuccess,
            });
        } else {
            post(route('dashboard.user-role.store'), {
                preserveScroll: true,
                onSuccess,
            });
        }
    };

    return (
        <form onSubmit={submit} className="grid grid-cols-8 gap-4 [&_div]:mb-0">
            <Card className="col-span-8 grid grid-cols-8 gap-4 border-0 shadow-none [&_div]:mb-0">
                <CardContent className="col-span-8 flex flex-col gap-4 [&_div]:mb-0">
                    <Field>
                        <FieldLabel htmlFor="name">
                            Role Name{' '}
                            <span className="text-destructive">*</span>
                        </FieldLabel>

                        <Input
                            id="name"
                            type="text"
                            placeholder="admin"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />

                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {errors.name}
                            </p>
                        )}
                    </Field>

                    {allPermissions.length > 0 && (
                        <div className="space-y-4">
                            <FieldLabel>Permissions / Access Rights</FieldLabel>

                            <div className="max-h-[300px] space-y-4 overflow-y-auto rounded-md border p-3 pr-2">
                                {Object.entries(grouped).map(
                                    ([groupName, groupPerms]) => {
                                        const allChecked = groupPerms.every(
                                            (p) =>
                                                data.permissions.includes(
                                                    p.name,
                                                ),
                                        );

                                        return (
                                            <div
                                                key={groupName}
                                                className="space-y-2 border-b pb-3 last:border-b-0 last:pb-0"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <span className="text-xs font-semibold tracking-wider text-muted-foreground">
                                                        MODULE: {groupName}
                                                    </span>
                                                    <Button
                                                        type="button"
                                                        variant="ghost"
                                                        className="h-6 px-2 text-xs"
                                                        onClick={() =>
                                                            toggleGroup(
                                                                groupPerms,
                                                            )
                                                        }
                                                    >
                                                        {allChecked
                                                            ? 'Deselect Module'
                                                            : 'Select Module'}
                                                    </Button>
                                                </div>

                                                <div className="grid grid-cols-2 gap-2">
                                                    {groupPerms.map((perm) => {
                                                        const checked =
                                                            data.permissions.includes(
                                                                perm.name,
                                                            );

                                                        return (
                                                            <label
                                                                key={perm.id}
                                                                className="flex cursor-pointer items-center space-x-2 rounded p-1 text-sm hover:bg-accent/50"
                                                            >
                                                                <Checkbox
                                                                    checked={
                                                                        checked
                                                                    }
                                                                    onCheckedChange={() =>
                                                                        togglePermission(
                                                                            perm.name,
                                                                        )
                                                                    }
                                                                />
                                                                <span className="capitalize">
                                                                    {perm.name}
                                                                </span>
                                                            </label>
                                                        );
                                                    })}
                                                </div>
                                            </div>
                                        );
                                    },
                                )}
                            </div>
                        </div>
                    )}
                </CardContent>
            </Card>

            <div className="col-span-8 mt-5 flex justify-end gap-2">
                <Button
                    type="button"
                    variant="secondary"
                    disabled={processing}
                    className="w-fit"
                    onClick={onCancel}
                >
                    Close
                </Button>

                <Button type="submit" disabled={processing} className="w-30">
                    <Save /> {isEdit ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
}

export default UserRoleForm;
