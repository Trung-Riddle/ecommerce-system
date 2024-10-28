import React, { useEffect } from "react";
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
import { IoChevronBackOutline } from "react-icons/io5";
import { Link, Navigate, useNavigate } from "react-router-dom";
import { loginAPI } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { LoginResponse } from "@/interfaces/auth";
import { useLoading } from "@/LoadingContext";
import { toast } from "sonner";
import { useAppDispatch, useAppSelector } from "@/hooks/useApp";
import { auth } from "@/redux/slices/user.slice";
import { motion } from "framer-motion";
import NotFound from "../NotFound";

const formSchema = z.object({
  shopName: z
    .string()
    .min(8, { message: "Tối thiểu 8 kí tự." })
    .max(20, { message: "Không được quá 20 kí tự." }),
});

const UpdateRole = () => {
  const { current } = useAppSelector(state => state.user)
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      shopName: "",
    },
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const { setIsLoading } = useLoading();
  const mutation = useMutation<LoginResponse, any, FieldValues>({
    mutationFn: loginAPI, // Hàm login được gọi
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      
    },
    onError: (error) => {
        toast.error("Oops! có lỗi xảy ra, thử lại sau");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    mutation.mutate(values);
  }
  if (current.role != 'user') {
    return <NotFound />
  }
  return (
    <div className="md:w-3/4 sm:w-full lg:w-2/3 mx-auto h-screen">
      <motion.h1
        initial={{ opacity: 0, x: -150 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 1 }}
        className="text-center text-[28px] font-bold uppercase leading-tight py-10"
      >
        Để Bắt đầu hãy đặt tên cho cửa hàng của bạn
      </motion.h1>
      <motion.span
        initial={{ opacity: 0, x: 150 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.8 }}
        className="text-center text-xs text-gray-500 uppercase leading-6 block"
      >
        Cửa hàng của bạn sẽ thay thế cho thông tin tài khoản cá nhân khi đăng
        bán sản phẩm
      </motion.span>
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="space-y-4 rounded-lg p-2 md:w-[500px] mx-auto my-10"
        >
          <FormField
            control={form.control}
            name="shopName"
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input
                    type="email"
                    placeholder="Nhập vào tên cửa hàng của bạn"
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="pt-3">
            <Button className="w-full" type="submit">
              Nhấn để bắt đầu
            </Button>
          </div>
          <p className="text-main flex-center gap-2 cursor-pointer" onClick={() => navigate(-1)}>
            <IoChevronBackOutline />
            <span>Quay lại</span>
          </p>
        </form>
      </Form>
    </div>
  );
};

export default UpdateRole;
