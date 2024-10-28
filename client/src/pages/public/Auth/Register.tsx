import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Link, useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { useForm, FieldValues } from "react-hook-form";
import { RegisterResponse } from "@/interfaces/auth";
import { registerAPI } from "@/api/auth";
import { toast } from "sonner";
import { useLoading } from "@/LoadingContext";

const formSchema = z
  .object({
    username: z
      .string()
      .min(6, { message: "[!] Username tối thiểu 6 kí tự." })
      .max(20, { message: "[!] Username không được quá 20 kí tự" }),

    email: z.string().email({ message: "[!] Email không hợp lệ." }),

    password: z
      .string()
      .min(8, { message: "[!] Password tối thiểu 8 kí tự." })
      .max(20, { message: "[!] Password không được quá 20 kí tự." })
      .regex(/[a-zA-Z]/, {
        message: "[!] Password phải chứa ít nhất một chữ cái.",
      })
      .regex(/[0-9]/, { message: "[!] Password phải chứa ít nhất một số." }),

    confirmPassword: z.string(),
  })
  .strict()
  .superRefine(({ confirmPassword, password }, ctx) => {
    if (confirmPassword !== password) {
      ctx.addIssue({
        code: "custom",
        message: "[!] Mật khẩu không khớp",
        path: ["confirmPassword"],
      });
    }
  });

const Register = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      password: "trung0605",
      confirmPassword: "trung0605",
      email: "",
    },
  });
  const { email } = form.getValues();
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const mutation = useMutation<RegisterResponse, any, FieldValues>({
    mutationFn: registerAPI, // Hàm login được gọi
    onMutate: () => {
      setIsLoading(true)
    },
    onSuccess: (data) => {
      // Xử lý khi register thành công
      if (data.message) {
        toast(data.message);
        localStorage.setItem("emailOtp", email);
      }
      navigate("/auth/verify-otp");
      console.log("Register successful:", data);
    },
    onError: (error) => {
      toast(error.message || 'Oop! Có lỗi xảy ra');
      console.log('error register', error)
    },
    onSettled: () => {
      setIsLoading(false)
    }
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    const { email, password, username } = values;
    mutation.mutate({ email, password, username });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4 border rounded-lg p-2 md:w-[500px] mx-auto"
      >
        <h2 className="font-semibold text-2xl text-center">
          Đăng ký tài khoản
        </h2>
        <FormField
          control={form.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input type="text" placeholder="Nhập vào username" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="email"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Email</FormLabel>
              <FormControl>
                <Input
                  type="email"
                  placeholder="Nhập vào email của bạn"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="password"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Password</FormLabel>
              <FormControl>
                <Input type="password" placeholder="Nhập mật khẩu" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <FormField
          control={form.control}
          name="confirmPassword"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Confirm password</FormLabel>
              <FormControl>
                <Input
                  type="password"
                  placeholder="Nhập lại mật khẩu"
                  {...field}
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        <div className="pt-3">
          <Button className="w-full" type="submit">
            Đăng Ký
          </Button>
        </div>
        <p className="text-xs">
          &nbsp;Bạn đã có tài khoản?{" "}
          <Link className="text-main" to={"/auth/login"}>
            Đăng nhập
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default Register;
