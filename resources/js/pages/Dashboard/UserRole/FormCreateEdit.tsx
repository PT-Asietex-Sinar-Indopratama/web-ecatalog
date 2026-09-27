import { useForm } from '@inertiajs/react';
import { ChevronLeft, Save } from 'lucide-react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';

interface Role {
    id: number;
    name: string;
}

interface Props {
    role?: Role;
    onCancel?: () => void;
    onSuccess?: () => void;
}

export function UserRoleForm({ role, onCancel, onSuccess }: Props) {
    const isEdit = !!role;

    const { data, setData, post, put, processing, errors } = useForm({
        name: role?.name ?? '',
    });

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
                                {' '}
                                {errors.name}{' '}
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

export default UserRoleForm;
