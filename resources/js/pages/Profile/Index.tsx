import { Link } from '@inertiajs/react';
import { CalendarDays, LogOut, Mail, ShieldCheck, User } from 'lucide-react';
import { route } from 'ziggy-js';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import AppLayout from '@/Layouts/AppLayout';

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
    const joinedDate = new Intl.DateTimeFormat('en', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
    }).format(new Date(profile.created_at));

    return (
        <AppLayout className="max-w-3xl">
            <div className="space-y-6">
                <Card>
                    <CardHeader className="border-b">
                        <div className="flex items-center gap-4">
                            <div className="flex h-14 w-14 items-center justify-center rounded-full bg-blue-50 text-lg font-semibold text-blue-700">
                                {profile.name.charAt(0).toUpperCase()}
                            </div>
                            <div className="min-w-0 flex-1">
                                <CardTitle className="truncate text-xl">
                                    {profile.name}
                                </CardTitle>
                                <CardDescription className="truncate">
                                    {profile.email}
                                </CardDescription>
                            </div>
                            <Badge
                                variant={profile.is_active ? 'green' : 'yellow'}
                            >
                                {profile.is_active ? 'Active' : 'Inactive'}
                            </Badge>
                        </div>
                    </CardHeader>

                    <CardContent>
                        <div className="grid gap-4 sm:grid-cols-2">
                            <div className="flex items-start gap-3 rounded-lg border p-4">
                                <Mail className="mt-0.5 h-4 w-4 text-slate-500" />
                                <div className="min-w-0">
                                    <p className="text-xs font-medium text-slate-500 uppercase">
                                        Email
                                    </p>
                                    <p className="truncate font-medium">
                                        {profile.email}
                                    </p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border p-4">
                                <ShieldCheck className="mt-0.5 h-4 w-4 text-slate-500" />
                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase">
                                        Role
                                    </p>
                                    <div className="mt-1 flex flex-wrap gap-2">
                                        {profile.roles &&
                                        profile.roles.length > 0 ? (
                                            profile.roles.map((role) => (
                                                <Badge
                                                    key={role.id}
                                                    variant="secondary"
                                                >
                                                    {role.name}
                                                </Badge>
                                            ))
                                        ) : (
                                            <span className="text-sm text-muted-foreground">
                                                No role
                                            </span>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border p-4">
                                <CalendarDays className="mt-0.5 h-4 w-4 text-slate-500" />
                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase">
                                        Joined
                                    </p>
                                    <p className="font-medium">{joinedDate}</p>
                                </div>
                            </div>

                            <div className="flex items-start gap-3 rounded-lg border p-4">
                                <User className="mt-0.5 h-4 w-4 text-slate-500" />
                                <div>
                                    <p className="text-xs font-medium text-slate-500 uppercase">
                                        User ID
                                    </p>
                                    <p className="font-medium">#{profile.id}</p>
                                </div>
                            </div>
                        </div>

                        <div className="flex justify-end border-t pt-4">
                            <Link
                                href={route('logout')}
                                method="post"
                                as="button"
                            >
                                <Button variant="destructive">
                                    <LogOut className="h-4 w-4" />
                                    Logout
                                </Button>
                            </Link>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </AppLayout>
    );
}
