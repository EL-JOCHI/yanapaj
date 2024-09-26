import {z} from "zod"
import {zodResolver} from "@hookform/resolvers/zod";
import {useForm} from "react-hook-form";
import {toast} from "@/hooks/use-toast.ts";
import {Form, FormControl, FormField, FormItem, FormLabel, FormMessage} from "@/components/ui/form.tsx";
import {Input} from "@/components/ui/input.tsx";
import {Button} from "@/components/ui/button.tsx";
import {Link, useNavigate} from "react-router-dom";
import {AuthenticationControllerService} from "@/client";
import {apiClient} from "@/api/api-client.ts";


const LoginSchema = z.object({
    email: z.string().email({message: "Invalid email address"}),
    password: z
        .string()
        .min(8, {message: "Password must be at least 8 characters"})
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]+$/, {
            message: "Password must contain at least one uppercase letter, one lowercase letter, one number and one special character"
        }),
})


export default function Login() {

    const navigate = useNavigate();

    const form = useForm<z.infer<typeof LoginSchema>>({
        resolver: zodResolver(LoginSchema),
        defaultValues: {
            email: "",
            password: ""
        },
    })

    async function onSubmit(data: z.infer<typeof LoginSchema>) {
        console.log(JSON.stringify(data, null, 2));
        try {
            const response = await AuthenticationControllerService.login({
                client: apiClient,
                body: {
                    email: data.email,
                    password: data.password,
                },
            });

            // Assuming the response.data contains the JWT token
            const token = response.data;

            // Store the token (consider more secure options for production)
            if (typeof token === "string") {
                localStorage.setItem('token', token);
            }

            toast({
                title: "Login Successful",
                description: "You have been logged in.",
            });

            navigate('/dashboard'); // Or your desired route
        } catch (error) {
            console.error("Login error:", error);
            toast({
                title: "Login Failed",
                description: "Invalid email or password.", // Or a more specific error message
            });
        }
    }


    return (
        <div
            className="flex min-h-screen flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8 font-insideout">
            <div
                className="w-full max-w-md space-y-8 bg-white dark:bg-gray-800 dark:text-white p-6 rounded-lg shadow-md">
                <h2 className="text-center text-3xl font-extrabold text-gray-900 dark:text-indigo-500">
                    🔑 Sign in YANAPAJ!
                </h2>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                        <FormField
                            control={form.control}
                            name="email"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="dark:text-sky-50">📧 Email</FormLabel>
                                    <FormControl>
                                        <Input placeholder="Enter your email" {...field}
                                               className="w-full dark:bg-white dark:text-gray-900"/>
                                    </FormControl>
                                    <FormMessage className="dark:text-red-400"/>
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="password"
                            render={({field}) => (
                                <FormItem>
                                    <FormLabel className="dark:text-sky-50">🔐 Password</FormLabel>
                                    <FormControl>
                                        <Input type="password" placeholder="Enter your password" {...field}
                                               className="w-full dark:bg-white dark:text-gray-900"/>
                                    </FormControl>
                                    <FormMessage className="dark:text-red-400"/>
                                </FormItem>
                            )}
                        />
                        <Button type="submit" className="w-full dark:bg-indigo-500 dark:text-white">➡️ Sign in</Button>
                    </form>
                </Form>
                <p className="mt-2 text-center text-sm text-gray-600">
                    👋 Don't have an account?{" "}
                    <Link
                        to="/register"
                        className="font-medium text-indigo-600 hover:text-indigo-500"
                    >
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};