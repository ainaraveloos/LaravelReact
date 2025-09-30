import Checkbox from "@/Components/Checkbox";
import { FormInput } from "@/Components/FormInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button } from "antd";
import { FormEventHandler } from "react";

export default function Login({
    status,
    canResetPassword,
}: {
    status?: string;
    canResetPassword: boolean;
}) {
    const { data, setData, post, processing, errors, reset } = useForm({
        email: "",
        password: "",
        remember: false as boolean,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        post(route("login"), {
            onFinish: () => reset("password"),
        });
    };

    return (
        <GuestLayout>
            <Head title="Log in" />
            {status && (
                <div className="mb-4 text-sm font-medium text-green-600">
                    {" "}
                    {status}{" "}
                </div>
            )}

            <form onSubmit={submit}>
                <div className="space-y-4">
                    <FormInput
                        name="email"
                        type="email"
                        label="Email"
                        value={data.email}
                        error={errors.email}
                        onChange={(name, value) => setData(name as any, value)}
                    />

                    <FormInput
                        name="password"
                        type="password"
                        label="Password"
                        value={data.password}
                        error={errors.password}
                        onChange={(name, value) => setData(name as any, value)}
                    />
                </div>

                <div className="mt-4 block">
                    <label className="flex items-center">
                        <Checkbox
                            name="remember"
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    "remember",
                                    (e.target.checked || false) as false
                                )
                            }
                        />
                        <span className="ms-2 text-sm text-gray-600">
                            Remember me
                        </span>
                    </label>
                </div>

                <div className="mt-4 flex items-center justify-end">
                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="rounded-md text-sm text-gray-600 underline hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                        >
                            Forgot your password?
                        </Link>
                    )}

                    <Button
                        size="large"
                        type="primary"
                        htmlType="submit"
                        loading={processing}
                        className="ms-4"
                    >
                        Connexion
                    </Button>
                </div>
            </form>
        </GuestLayout>
    );
}
