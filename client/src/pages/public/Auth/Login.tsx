import React from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues, SubmitHandler } from "react-hook-form";
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
import { FcGoogle } from "react-icons/fc";
import { Link, useNavigate } from "react-router-dom";
import { loginAPI } from "@/api/auth";
import { useMutation } from '@tanstack/react-query';
import { LoginResponse } from "@/interfaces/auth";
import { useLoading } from "@/LoadingContext";
import { toast } from "sonner";
import { useAppDispatch } from "@/hooks/useApp";
import { auth } from "@/redux/slices/user.slice";


const formSchema = z.object({
  email: z.string().email({ message: "Email không hợp lệ." }),

  password: z
    .string()
    .min(8, { message: "Password tối thiểu 8 kí tự." })
    .max(20, { message: "Password không được quá 20 kí tự." })
    .regex(/[a-zA-Z]/, { message: "Password phải chứa ít nhất một chữ cái." })
    .regex(/[0-9]/, { message: "Password phải chứa ít nhất một số." }),
});

const Login = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "nguyendinhtrung06052001@gmail.com",
      password: "trung0605",
    },
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch()
  const { setIsLoading } = useLoading();
  const mutation = useMutation<LoginResponse, any, FieldValues>({
    mutationFn: loginAPI, // Hàm login được gọi
    onMutate: () => {
      setIsLoading(true)
    },
    onSuccess: (data) => {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
      dispatch(auth(data.user))
      navigate('/')
    },
    onError: (error) => {
      if (error.response.status === 401) {
        toast.error('Thông tin đăng nhập không chính xác!')
        return
      } 
      if (error.response.data.emailNotVerify) {
        toast.info('Email của bạn vẫn chưa xác thực, vui lòng kiểm tra hòm thư')
        navigate('/auth/verify-otp')
      } else {
        toast.error('Lỗi đăng nhập, thử lại sau')
      }
    },
    onSettled: () => {
      setIsLoading(false)
    }
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
    
  }
  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 border rounded-lg p-2 md:w-[500px] mx-auto">
      <h2 className='font-semibold text-2xl text-center'>Đăng nhập tài khoản</h2>
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
        <div className="pt-3">
          <Button className="w-full" type="submit">
            Đăng Nhập
          </Button>
        </div>
        <p className="text-xs">&nbsp;Bạn chưa có tài khoản? <Link className="text-main" to={'/auth/register'}>Đăng ký</Link></p>
        <div className="flex items-center justify-center gap-3 my-3">
          <div className="flex-1 border-t"></div>
          <div className="text-xs">OR</div>
          <div className="flex-1 border-t"></div>
        </div>
        <div className="py-3">
          <Button variant='outline' className="w-full" type="button">
            <FcGoogle size={22}/>
          </Button>
        </div>
      </form>
    </Form>
  );
};

export default Login;
