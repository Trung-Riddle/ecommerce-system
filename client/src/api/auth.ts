import {
  LoginResponse,
  RegisterResponse,
  VerifyOTPResponse,
} from "@/interfaces/auth";
import instance from "./instance";
import { FieldValues } from "react-hook-form";

export const loginAPI = async (data: FieldValues): Promise<LoginResponse> => {
  const response = await instance({
    method: "POST",
    url: "/auth/login",
    data,
  });
  return response.data;
};
export const registerAPI = async (
  data: FieldValues
): Promise<RegisterResponse> => {
  const response = await instance({
    method: "POST",
    url: "/auth/register",
    data,
  });
  return response.data;
};
export const verifyOtpAPI = async (
  data: FieldValues
): Promise<VerifyOTPResponse> => {
  const response = await instance({
    method: "POST",
    url: "/auth/verify-email",
    data,
  });
  return response.data;
};
export const logoutAPI = async (data: { refreshToken: string | null }) =>
  instance({
    method: "POST",
    url: "/auth/logout",
    data,
  });
