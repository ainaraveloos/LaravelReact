import { FormInput } from "@/Components/FormInput";
import GuestLayout from "@/Layouts/GuestLayout";
import { Head, Link, useForm } from "@inertiajs/react";
import { Button, Checkbox } from "antd";
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
            <Head title="Connexion" />
            {status && (
                <div className="mb-4 rounded-md border border-green-200 bg-green-50 px-3 py-2 text-sm font-medium text-green-700">
                    {status}
                </div>
            )}

            <form onSubmit={submit} className="space-y-6">
                {/* Logo Section */}
                <div className="flex items-center justify-center gap-3 mb-10 animate-slide-in">
                    <span className="text-4xl font-bold text-yellow-500 logo-animation">
                        LOGO
                    </span>
                </div>

                {/* Email Field */}
                <div>
                    <div className="relative">
                        <FormInput
                            name="email"
                            type="email"
                            value={data.email}
                            error={errors.email}
                            onChange={(name, value) =>
                                setData(name as any, value)
                            }
                            placeholder="exemple@medicare.com"
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Password Field */}
                <div>
                    <div className="relative">
                        <FormInput
                            name="password"
                            type="password"
                            value={data.password}
                            error={errors.password}
                            onChange={(name, value) =>
                                setData(name as any, value)
                            }
                            placeholder="••••••••"
                            className="w-full"
                        />
                    </div>
                </div>

                {/* Options */}
                <div className="flex items-center justify-between">
                    <label className="flex items-center space-x-2">
                        <Checkbox
                            checked={data.remember}
                            onChange={(e) =>
                                setData(
                                    "remember",
                                    (e.target.checked || false) as false
                                )
                            }
                            className="text-slate-600"
                        >
                            <span className="text-sm text-gray-600">
                                Se souvenir de moi
                            </span>
                        </Checkbox>
                    </label>

                    {canResetPassword && (
                        <Link
                            href={route("password.request")}
                            className="text-sm font-medium bg-gradient-to-r from-yellow-700 to-yellow-600 bg-clip-text text-transparent hover:from-yellow-500 hover:to-yellow-400 transition-colors duration-500"
                        >
                            Mot de passe oublié ?
                        </Link>
                    )}
                </div>

                {/* Submit Button */}
                <Button
                    size="large"
                    type="primary"
                    htmlType="submit"
                    loading={processing}
                    className="!mt-16"
                    block
                >
                    Connexion
                </Button>
            </form>
        </GuestLayout>
    );
}
