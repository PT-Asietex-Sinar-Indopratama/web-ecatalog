import { useForm } from '@inertiajs/react';
import { LogIn } from 'lucide-react';
import { route } from 'ziggy-js';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Field, FieldLabel } from '@/components/ui/field';
import { Input } from '@/components/ui/input';
import AuthLayout from '@/Layouts/AuthLayout';

export default function Login() {
    const { data, setData, post, processing, errors } = useForm({
        email: '',
        password: '',
    });

    const submit = (e: React.FormEvent) => {
        e.preventDefault();
        post(route('login'));
    };

    return (
        <AuthLayout>
            <Card className="w-full max-w-sm border shadow-sm">
                <CardHeader className="place-items-start text-left">
                    <CardTitle>Login</CardTitle>
                </CardHeader>
                <CardContent className="[&_div]:mb-0">
                    <form
                        onSubmit={submit}
                        className="flex flex-col gap-4 [&_div]:mb-0"
                    >
                        <Field>
                            <FieldLabel htmlFor="email">
                                Email{' '}
                                <span className="text-destructive">*</span>
                            </FieldLabel>

                            <Input
                                id="email"
                                type="email"
                                placeholder="name@example.com"
                                value={data.email}
                                onChange={(e) =>
                                    setData('email', e.target.value)
                                }
                                required
                            />

                            {errors.email && (
                                <p className="text-sm text-red-500">
                                    {errors.email}
                                </p>
                            )}
                        </Field>

                        <Field>
                            <FieldLabel htmlFor="password">
                                Password{' '}
                                <span className="text-destructive">*</span>
                            </FieldLabel>

                            <Input
                                id="password"
                                type="password"
                                placeholder="Enter your password"
                                value={data.password}
                                onChange={(e) =>
                                    setData('password', e.target.value)
                                }
                                required
                            />

                            {errors.password && (
                                <p className="text-sm text-red-500">
                                    {errors.password}
                                </p>
                            )}
                        </Field>

                        <Button
                            type="submit"
                            disabled={processing}
                            className="mt-2 w-full"
                        >
                            <LogIn /> Login
                        </Button>
                    </form>
                </CardContent>
            </Card>
        </AuthLayout>
    );
}
