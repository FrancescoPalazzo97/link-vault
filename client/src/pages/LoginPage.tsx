import { zodResolver } from "@hookform/resolvers/zod";
import { loginSchema } from "@link-vault/shared";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Field, FieldGroup, FieldLabel } from "@/components/ui/field";
import { Input } from "@/components/ui/input";
import { api } from "@/lib/api";
import { useAuthStore } from "@/stores/authStore";

type LoginData = z.infer<typeof loginSchema>;

export function LoginPage() {
	const login = useAuthStore((s) => s.login);
	const navigate = useNavigate();

	const {
		register,
		handleSubmit,
		setError,
		formState: { errors, isSubmitting },
	} = useForm<LoginData>({
		resolver: zodResolver(loginSchema),
		defaultValues: { password: "" },
	});

	const onSubmit = async (data: LoginData) => {
		try {
			const res = await api.post<{ token: string }>("/auth/login", data);
			login(res.token);
			navigate("/");
		} catch (err) {
			setError("password", {
				message: err instanceof Error ? err.message : "Login failed",
			});
		}
	};

	return (
		<div className="flex min-h-svh w-full items-center justify-center p-6 md:p-10">
			<div className="w-full max-w-sm">
				<Card>
					<CardHeader>
						<CardTitle>LinkVault</CardTitle>
						<CardDescription>Enter your password to continue</CardDescription>
					</CardHeader>
					<CardContent>
						<form onSubmit={handleSubmit(onSubmit)}>
							<FieldGroup>
								<Field>
									<FieldLabel htmlFor="password">Password</FieldLabel>
									<Input id="password" type="password" {...register("password")} />
									{errors.password && (
										<p className="text-destructive text-sm">{errors.password.message}</p>
									)}
								</Field>
								<Field>
									<Button type="submit" className="w-full" disabled={isSubmitting}>
										{isSubmitting ? "Logging in..." : "Login"}
									</Button>
								</Field>
							</FieldGroup>
						</form>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
