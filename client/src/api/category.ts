import { CreateCategoryResponse, getALlCategoryResponse } from "@/interfaces/category";
import instance from "./instance";
import { FieldValues } from "react-hook-form";

export const createCategoryAPI = async (
  data: FieldValues
): Promise<CreateCategoryResponse> => {
  const response = await instance({
    method: "POST",
    url: "/category/create-category",
    data,
  });
  return response.data;
};
export const getAllCategoryAPI = async (): Promise<getALlCategoryResponse[]> => {
  const response = await instance({
    method: "GET",
    url: "/category/get-all",
  });
  return response.data.categories;
};
