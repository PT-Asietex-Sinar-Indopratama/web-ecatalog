import type { PageProps } from '@inertiajs/core';
import { Link, useForm, usePage } from '@inertiajs/react';
import {
    CalendarDays,
    KeyRound,
    LogOut,
    Mail,
    Save,
    ShieldCheck,
    User,
} from 'lucide-react';
import type { FormEvent } from 'react';
import { route } from 'ziggy-js';
import { AlertComponent } from '@/components/common/AlertComponent';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import DashboardLayout from '@/Layouts/DashboardLayout';

interface Role {
    id: number;
    name: string;
}

interface ProfileUser {
    id: number;
    name: string;
    email: string;
    email_verified_at: string | null;
    is_active?: boolean;
    created_at: string;
    roles?: Role[];
}

interface ProfileProps {
    profile: ProfileUser;
}

export default function Profile({ profile }: ProfileProps) {
    const { flash } = usePage<PageProps>().props;
    const { data, setData, put, processing, errors, reset } = useForm({
        current_password: '',
        password: '',
        password_confirmation: '',
    });

    const joinedDate = new Intl.DateTimeFormat('en-US', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(profile.created_at));

    const initials = profile.name
        .split(' ')
        .map((n) => n[0])
        .join('')
        .slice(0, 2)
        .toUpperCase();

    const submitPassword = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        put(route('profile.password.update'), {
            preserveScroll: true,
            onSuccess: () =>
                reset('current_password', 'password', 'password_confirmation'),
        });
    };

    return (
        <DashboardLayout
            breadcrumbs={[{ label: 'Profile' }]}
            className="min-h-0 gap-6"
        >
            {flash && (
                <AlertComponent
                    title={flash.message}
                    variant={flash.type}
                    className="col-span-4"
                />
            )}

            {/* Main Profile Info Card */}
            <div className="col-span-4 space-y-6 lg:col-span-4">
                <Card className="overflow-hidden border-border/60 pt-0 shadow-sm transition-all duration-200 hover:shadow-md">
                    {/* Header Banner & Hero Profile Info */}
                    <div className="h-24 bg-gradient-to-r from-blue-600 via-indigo-600 to-sky-500 opacity-90 sm:h-32" />
                    <CardHeader className="relative px-6 pt-0 pb-6">
                        <div className="-mt-8 flex flex-col items-start gap-4 sm:-mt-10 sm:flex-row sm:items-end sm:justify-between">
                            <div className="flex items-end gap-4">
                                <div className="flex size-20 items-center justify-center rounded-2xl bg-primary text-2xl font-bold text-primary-foreground shadow-md ring-4 ring-background sm:size-24 sm:text-3xl">
                                    {initials}
                                </div>
                                <div className="space-y-1 pb-1">
                                    <div className="flex items-center gap-2">
                                        <CardTitle className="text-xl font-bold tracking-tight sm:text-2xl">
                                            {profile.name}
                                        </CardTitle>
                                        <Badge
                                            variant={
                                                profile.is_active
                                                    ? 'green'
                                                    : 'yellow'
                                            }
                                            className="px-2.5 py-0.5 font-medium"
                                        >
                                            {profile.is_active
                                                ? 'Active Account'
                                                : 'Inactive'}
                                        </Badge>
                                    </div>
                                    <CardDescription className="text-sm font-normal text-muted-foreground">
                                        {profile.email}
                                    </CardDescription>
                                </div>
                            </div>

                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                                className="w-full sm:w-auto"
                            >
                                <Button
                                    variant="destructive"
                                    className="w-full transition-transform duration-160 active:scale-[0.97] sm:w-auto"
                                >
                                    <LogOut className="mr-1.5 size-4" />
                                    Logout
                                </Button>
                            </Link>
                        </div>
                    </CardHeader>

                    {/* Profile Detail Grid */}
                    <CardContent className="space-y-6 border-t bg-slate-50/50 px-6 py-6 dark:bg-slate-900/50">
                        <h3 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
                            Account Information
                        </h3>
                        <div className="grid gap-4 sm:grid-cols-2">
                            {/* User ID */}
                            <div className="flex items-start gap-3.5 rounded-xl border border-border/60 bg-background p-4 shadow-2xs transition-colors hover:bg-muted/40">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-blue-50 text-blue-600 dark:bg-blue-950/60 dark:text-blue-400">
                                    <User className="size-4.5" />
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        User ID
                                    </p>
                                    <p className="font-semibold text-foreground">
                                        #{profile.id}
                                    </p>
                                </div>
                            </div>

                            {/* Email */}
                            <div className="flex items-start gap-3.5 rounded-xl border border-border/60 bg-background p-4 shadow-2xs transition-colors hover:bg-muted/40">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-sky-50 text-sky-600 dark:bg-sky-950/60 dark:text-sky-400">
                                    <Mail className="size-4.5" />
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Email Address
                                    </p>
                                    <p className="truncate font-semibold text-foreground">
                                        {profile.email}
                                    </p>
                                </div>
                            </div>

                            {/* Role */}
                            <div className="flex items-start gap-3.5 rounded-xl border border-border/60 bg-background p-4 shadow-2xs transition-colors hover:bg-muted/40">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-indigo-50 text-indigo-600 dark:bg-indigo-950/60 dark:text-indigo-400">
                                    <ShieldCheck className="size-4.5" />
                                </div>
                                <div className="min-w-0 space-y-1">
                                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Assigned Roles
                                    </p>
                                    <div className="flex flex-wrap gap-1.5">
                                        {profile.roles &&
                                        profile.roles.length > 0 ? (
                                            profile.roles.map((role) => (
                                                <Badge
                                                    key={role.id}
                                                    variant="secondary"
                                                    className="font-medium"
                                                >
                                                    {role.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm font-medium text-muted-foreground">
                                                No role assigned
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            {/* Joined Date */}
                            <div className="flex items-start gap-3.5 rounded-xl border border-border/60 bg-background p-4 shadow-2xs transition-colors hover:bg-muted/40">
                                <div className="flex size-9 shrink-0 items-center justify-center rounded-lg bg-emerald-50 text-emerald-600 dark:bg-emerald-950/60 dark:text-emerald-400">
                                    <CalendarDays className="size-4.5" />
                                </div>
                                <div className="min-w-0 space-y-0.5">
                                    <p className="text-xs font-semibold tracking-wider text-muted-foreground uppercase">
                                        Member Since
                                    </p>
                                    <p className="font-semibold text-foreground">
                                        {joinedDate}
                                    </p>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>

                <Card className="border-border/60 shadow-sm">
                    <CardHeader className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                        <div className="space-y-1">
                            <CardTitle className="flex items-center gap-2">
                                <KeyRound className="size-5 text-muted-foreground" />
                                Change Password
                            </CardTitle>
                            <CardDescription>
                                Update your account password securely.
                            </CardDescription>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <form
                            onSubmit={submitPassword}
                            className="grid gap-4 md:grid-cols-3"
                        >
                            <Field>
                                <FieldLabel htmlFor="current_password">
                                    Current Password
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="current_password"
                                    type="password"
                                    autoComplete="current-password"
                                    value={data.current_password}
                                    onChange={(event) =>
                                        setData(
                                            'current_password',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={!!errors.current_password}
                                    required
                                />
                                {errors.current_password && (
                                    <p className="text-sm text-red-500">
                                        {errors.current_password}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password">
                                    New Password
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="password"
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password}
                                    onChange={(event) =>
                                        setData('password', event.target.value)
                                    }
                                    aria-invalid={!!errors.password}
                                    required
                                />
                                {errors.password && (
                                    <p className="text-sm text-red-500">
                                        {errors.password}
                                    </p>
                                )}
                            </Field>

                            <Field>
                                <FieldLabel htmlFor="password_confirmation">
                                    Confirm Password
                                    <span className="text-destructive">*</span>
                                </FieldLabel>
                                <Input
                                    id="password_confirmation"
                                    type="password"
                                    autoComplete="new-password"
                                    value={data.password_confirmation}
                                    onChange={(event) =>
                                        setData(
                                            'password_confirmation',
                                            event.target.value,
                                        )
                                    }
                                    aria-invalid={
                                        !!errors.password_confirmation
                                    }
                                    required
                                />
                                {errors.password_confirmation && (
                                    <p className="text-sm text-red-500">
                                        {errors.password_confirmation}
                                    </p>
                                )}
                            </Field>

                            <div className="md:col-span-3">
                                <Button type="submit" disabled={processing}>
                                    <Save />
                                    {processing
                                        ? 'Saving...'
                                        : 'Update Password'}
                                </Button>
                            </div>
                        </form>
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}
