import { useEffect, useRef } from "react";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, FieldValues } from "react-hook-form";
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
import { useNavigate } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useLoading } from "@/LoadingContext";
import { useAppDispatch } from "@/hooks/useApp";
import { FcAddImage } from "react-icons/fc";
import { FaRegTrashAlt } from "react-icons/fa";
import { createCategoryAPI, getAllCategoryAPI } from "@/api/category";
import { CreateCategoryResponse } from "@/interfaces/category";
import { toast } from "sonner";
import useFileInput from "@/hooks/useFileUpload";
import { generateCode } from "@/utils/fn";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const formSchema = z.object({
  name: z
    .string()
    .min(4, { message: "Tên danh mục tối thiểu 4 kí tự." })
    .max(150, { message: "Password không được quá 150 kí tự." }),
  parentCategory: z.string({
    required_error: 'Vui lòng chọn loại danh mục'
  }),
});

const Create = () => {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      parentCategory: "",
    },
  });
  const navigate = useNavigate();
  const dispatch = useAppDispatch();
  const inputFileRef = useRef<any>(null);
  const { setIsLoading } = useLoading();
  const singleFileInput = useFileInput({ maxSizeMB: 5, maxFiles: 1 });

  const { data } = useQuery({
    queryKey: ["categories"],
    queryFn: getAllCategoryAPI,
  });
  useEffect(() => {
    console.log(data);
  }, [data]);

  const mutation = useMutation<CreateCategoryResponse, any, FieldValues>({
    mutationFn: createCategoryAPI,
    onMutate: () => {
      setIsLoading(true);
    },
    onSuccess: (data) => {
      singleFileInput.clear();
      toast("Bạn đã thêm danh mục thành công");
    },
    onError: (error) => {
      toast("co loi xay ra");
    },
    onSettled: () => {
      setIsLoading(false);
    },
  });
  function onSubmit(values: z.infer<typeof formSchema>) {
    const { name, parentCategory } = values;
    const formData = new FormData();
    const code = generateCode(name);
    formData.append("name", name);
    formData.append("code", code);
    formData.append("parentCategory", parentCategory);

    if (singleFileInput.files.length > 0) {
      formData.append("file", singleFileInput.files[0]);
    }

    mutation.mutate(formData);
  }
  return (
    <div className="my-5">
      <Form {...form}>
        <form
          onSubmit={form.handleSubmit(onSubmit)}
          className="border rounded-lg p-2 md:w-[500px] mx-auto"
        >
          <h2 className="font-semibold text-2xl text-center">
            Tạo danh mục của bạn
          </h2>
          <FormField
            control={form.control}
            name="name"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Tên danh mục</FormLabel>
                <FormControl>
                  <Input
                    type="text"
                    placeholder="Nhập vào danh mục mới..."
                    {...field}
                  />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="parentCategory"
            render={({ field }) => (
              <FormItem className="mt-4">
                <FormLabel>Thuộc loại danh mục</FormLabel>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <FormControl>
                    <SelectTrigger>
                      <SelectValue placeholder="Thuộc loại danh mục" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent>
                    {data &&
                      data.length > 0 &&
                      data.map((category) => (
                        <SelectItem key={category.code} value={category._id}>
                          {category.name}
                        </SelectItem>
                      ))}
                  </SelectContent>
                </Select>
                <FormMessage />
              </FormItem>
            )}
          />
          <input
            type="file"
            onChange={singleFileInput.handleFilesChange}
            ref={inputFileRef}
            name="image"
            id="image"
            hidden
          />
          <div
            onClick={() => inputFileRef?.current?.click()}
            className="w-full min-h-40 block my-5 flex-center"
          >
            {singleFileInput?.files?.length === 0 && (
              <div className="flex-center h-full cursor-pointer">
                <FcAddImage size={120} />
              </div>
            )}
            {singleFileInput?.files?.length > 0 &&
              singleFileInput.linkImages.map((link, index) => (
                <div className="relative w-full h-full min-h-40" key={index}>
                  <img
                    className="rounded-lg object-contain w-full h-full"
                    src={link}
                    alt={`Preview ${index}`}
                  />
                  <div
                    onClick={(e) => {
                      e.stopPropagation();
                      singleFileInput.removeFile(index);
                    }}
                    className="
                absolute top-1/2 left-1/2 -translate-y-1/2 -translate-x-1/2 
                w-10 h-10 shadow-md rounded-md cursor-pointer 
                bg-white bg-opacity-80 flex items-center justify-center
                hover:bg-opacity-75 transition-all duration-200
              "
                  >
                    <FaRegTrashAlt className="text-red-500" />
                  </div>
                </div>
              ))}
          </div>
          <div className="pt-3">
            <Button className="w-full" type="submit">
              Thêm mới
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default Create;
