import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { FieldValues, useForm } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormMessage,
} from "@/components/ui/form";
import { toast } from "sonner";
import { VerifyOTPResponse } from "@/interfaces/auth";
import { verifyOtpAPI } from "@/api/auth";
import { useMutation } from "@tanstack/react-query";
import { Link, useNavigate } from "react-router-dom";
import { useLoading } from "@/LoadingContext";
import { auth } from "@/redux/slices/user.slice";
import { useAppDispatch } from "@/hooks/useApp";

const FormSchema = z.object({
  otp: z.string().min(6, {
    message: "Vui lòng nhập đủ 6 số otp",
  }),
});

const Otp = () => {
  const form = useForm<z.infer<typeof FormSchema>>({
    resolver: zodResolver(FormSchema),
    defaultValues: {
      otp: "",
    },
  });
  const navigate = useNavigate();
  const { setIsLoading } = useLoading();
  const dispatch = useAppDispatch()
  
  const mutation = useMutation<VerifyOTPResponse, Error, FieldValues>({
    mutationFn: verifyOtpAPI,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      if (data.message) {
        toast(data.message);
      }
      localStorage.setItem("accessToken", data.accessToken);
      localStorage.setItem("refreshToken", data.refreshToken);
      dispatch(auth(data.user))
      navigate("/");
      console.log("Xac thuc thanh cong:", data);
    },
    onError: (error) => {
      toast(error.message || "Oop! Có lỗi xảy ra");
      console.error("verify failed:", error);
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });

  function onSubmit(data: z.infer<typeof FormSchema>) {
    const email = localStorage.getItem("emailOtp");
    mutation.mutate({ ...data, email });
  }
  return (
    <Form {...form}>
      <form
        onSubmit={form.handleSubmit(onSubmit)}
        className="md:w-1/3 sm:w-[80%] w-[80%] space-y-4 border rounded-lg mx-auto p-2"
      >
        <h2 className="font-semibold text-2xl text-center">
          Xác nhận tài khoản
        </h2>
        <FormField
          control={form.control}
          name="otp"
          render={({ field }) => (
            <FormItem className="mx-auto">
              <FormControl>
                <InputOTP maxLength={6} {...field}>
                  <InputOTPGroup className="mx-auto">
                    <InputOTPSlot index={0} />
                    <InputOTPSlot index={1} />
                    <InputOTPSlot index={2} />
                    <InputOTPSlot index={3} />
                    <InputOTPSlot index={4} />
                    <InputOTPSlot index={5} />
                  </InputOTPGroup>
                </InputOTP>
              </FormControl>
              <FormMessage className="text-center" />
              <FormDescription className="text-center">
                Nhập vào mã otp chúng tôi đã gửi cho bạn qua email.
              </FormDescription>
            </FormItem>
          )}
        />

        <Button className="w-full" type="submit">
          Xác nhận
        </Button>
        <p className="text-xs">
          &nbsp;Quay lại{" "}
          <Link className="text-main" to={"/auth/register"}>
            Đăng ký
          </Link>
        </p>
      </form>
    </Form>
  );
};

export default Otp;
