import { useState } from "react";
import useTypewriter from "@/hooks/useTypewriter";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { MdOutlineClear } from "react-icons/md";
import { IoIosSearch } from "react-icons/io";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";

const Search = () => {
  const [dropdownSearch, setDropdownSearch] = useState(false);
  //   const [keyword, setKeyword] = useState('')
  const { register, handleSubmit, watch, setValue } = useForm();
  const keyword = watch("keyword");
  const text = useTypewriter(["Áo thun nam", "Quần âu hàn quốc", "Đầm body"], {
    typeSpeed: 200,
    pauseBetweenTexts: 2500,
  });

  const onSubmit: SubmitHandler<FieldValues> = async (values) => {
    console.log({values, keyword});
  };
  return (
    <div className="w-full h-full flex-center">
      <div className="flex-center p-2 gap-4 h-[80%] bg-gray-50 rounded-lg w-full">
        <div className="w-1/4">
          <Select>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Chọn danh mục" />
            </SelectTrigger>
            <SelectContent className="z-[101]">
              <SelectGroup>
                <SelectLabel>Danh mục tổng thể</SelectLabel>
                <SelectItem value="apple">Thời trang</SelectItem>
                <SelectItem value="banana">Làm đẹp</SelectItem>
                <SelectItem value="blueberry">Công nghệ</SelectItem>
                <SelectItem value="grapes">Nội thất</SelectItem>
                <SelectItem value="pineapple">Gia dụng</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>
        <div className="border-x border-gray-300 h-4/6"></div>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className="flex flex-col w-3/4 relative border px-2 py-1 rounded-md shadow-sm"
        >
          <input
            className="w-[78%] bg-transparent focus-visible:outline-none selection:bg-slate-200"
            type="text"
            placeholder={text}
            spellCheck={false}
            {...register("keyword")}
            autoComplete="off"
            onFocus={() => setDropdownSearch(true)}
            onBlur={() => setDropdownSearch(false)}
          />
          <div className="absolute w-[22%] flex items-center justify-end gap-2 right-[2px] top-1/2 -translate-y-1/2">
            {keyword && <span onClick={() => setValue('keyword', '')} className="text-main">
              <MdOutlineClear />
            </span>}
            <Button type="submit" size="xs">
              Tìm Kiếm
            </Button>
          </div>
          {dropdownSearch && (
            <div className="absolute w-full shadow min-h-40 rounded-md top-[calc(100%+4px)] left-0 bg-white py-2">
                <div className="flex items-center gap-2 px-2 py-1 cursor-pointer hover:bg-slate-100 mx-1 rounded-lg">
                    <IoIosSearch size={20} />
                    <span>Quần legging</span>
                </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Search;
