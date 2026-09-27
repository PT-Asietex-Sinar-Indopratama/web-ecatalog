import { useForm } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import {
    Select,
    SelectContent,
    SelectGroup,
    SelectItem,
    SelectLabel,
    SelectTrigger,
} from '@/components/ui/select';

interface Role {
    id: number;
    name: string;
}

interface User {
    id: number;
    name: string;
    email: string;
    is_active: boolean;
    roles?: Role[];
}

interface Props {
    user?: User;
    roles: Role[];
    onCancel?: () => void;
    onSuccess?: () => void;
}

export function UserForm({ user, roles = [], onCancel, onSuccess }: Props) {
    const isEdit = !!user;

    const items = [
        { label: 'Active', value: '1' },
        { label: 'Inactive', value: '0' },
    ];

    const { data, setData, post, put, processing, errors } = useForm({
        name: user?.name ?? '',
        email: user?.email ?? '',
        password: '',
        role: user?.roles?.[0]?.name ?? '',
        is_active: user ? (user.is_active ? '1' : '0') : '',
    });

    const selectedRoleLabel = roles.find(
        (role) => role.name === data.role,
    )?.name;
    const selectedStatusLabel = items.find(
        (item) => item.value === data.is_active,
    )?.label;

    const submit = (e: React.FormEvent) => {
        e.preventDefault();

        if (isEdit) {
            put(route('dashboard.user.update', user.id), {
                preserveScroll: true,
                onSuccess,
            });
        } else {
            post(route('dashboard.user.store'), {
                preserveScroll: true,
                onSuccess,
            });
        }
    };

    return (
        <form onSubmit={submit} className="grid grid-cols-8 gap-4 [&_div]:mb-0">
            <Card className="col-span-8 grid grid-cols-8 gap-4 border-0 shadow-none [&_div]:mb-0">
                <CardContent className="col-span-8 flex flex-col gap-4 md:col-span-4 [&_div]:mb-0">
                    <Field>
                        <FieldLabel htmlFor="name">
                            Name <span className="text-destructive">*</span>
                        </FieldLabel>

                        <Input
                            id="name"
                            type="text"
                            placeholder="Admin User"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            required
                        />

                        {errors.name && (
                            <p className="text-sm text-red-500">
                                {' '}
                                {errors.name}{' '}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="email">
                            Email <span className="text-destructive">*</span>
                        </FieldLabel>

                        <Input
                            id="email"
                            type="email"
                            placeholder="admin@example.com"
                            value={data.email}
                            onChange={(e) => setData('email', e.target.value)}
                            required
                        />

                        {errors.email && (
                            <p className="text-sm text-red-500">
                                {' '}
                                {errors.email}{' '}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="password">
                            Password{' '}
                            {!isEdit && (
                                <span className="text-destructive">*</span>
                            )}
                        </FieldLabel>

                        <Input
                            id="password"
                            type="password"
                            placeholder={
                                isEdit
                                    ? 'Leave blank to keep current password'
                                    : 'Minimum 8 characters'
                            }
                            value={data.password}
                            onChange={(e) =>
                                setData('password', e.target.value)
                            }
                            required={!isEdit}
                        />

                        {errors.password && (
                            <p className="text-sm text-red-500">
                                {' '}
                                {errors.password}{' '}
                            </p>
                        )}
                    </Field>
                </CardContent>

                <CardContent className="col-span-8 flex flex-col gap-4 md:col-span-4 [&_div]:mb-0">
                    <Field>
                        <FieldLabel htmlFor="role">
                            Role <span className="text-destructive">*</span>
                        </FieldLabel>

                        <Select
                            value={data.role}
                            onValueChange={(value) =>
                                setData('role', value ?? '')
                            }
                            required
                        >
                            <SelectTrigger className="w-full">
                                <span
                                    className={
                                        selectedRoleLabel
                                            ? ''
                                            : 'text-muted-foreground'
                                    }
                                >
                                    {selectedRoleLabel ?? 'Select Role'}
                                </span>
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Role</SelectLabel>

                                    {roles.map((role) => (
                                        <SelectItem
                                            key={role.id}
                                            value={role.name}
                                        >
                                            {' '}
                                            {role.name}{' '}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {errors.role && (
                            <p className="text-sm text-red-500">
                                {' '}
                                {errors.role}{' '}
                            </p>
                        )}
                    </Field>

                    <Field>
                        <FieldLabel htmlFor="is_active">
                            Status <span className="text-destructive">*</span>
                        </FieldLabel>

                        <Select
                            value={data.is_active}
                            onValueChange={(value) =>
                                setData('is_active', value ?? '')
                            }
                            required
                        >
                            <SelectTrigger className="w-full">
                                <span
                                    className={
                                        selectedStatusLabel
                                            ? ''
                                            : 'text-muted-foreground'
                                    }
                                >
                                    {selectedStatusLabel ?? 'Select Status'}
                                </span>
                            </SelectTrigger>

                            <SelectContent>
                                <SelectGroup>
                                    <SelectLabel>Status</SelectLabel>

                                    {items.map((item) => (
                                        <SelectItem
                                            key={item.value}
                                            value={item.value}
                                        >
                                            {' '}
                                            {item.label}{' '}
                                        </SelectItem>
                                    ))}
                                </SelectGroup>
                            </SelectContent>
                        </Select>

                        {errors.is_active && (
                            <p className="text-sm text-red-500">
                                {' '}
                                {errors.is_active}{' '}
                            </p>
                        )}
                    </Field>
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
                    <ChevronLeft /> Cancel
                </Button>

                <Button type="submit" disabled={processing} className="w-30">
                    <Save /> {isEdit ? 'Update' : 'Create'}
                </Button>
            </div>
        </form>
    );
}

export default UserForm;
