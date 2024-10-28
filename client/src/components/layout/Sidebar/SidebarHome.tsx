import Filter from "@/components/Filter/FilterCheckBox";
import { useRef, useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import { CiFilter } from "react-icons/ci";

const data = [
  {
    id: "123",
    value: "Thành Phố Hồ Chí Minh",
  },
  {
    id: "abc",
    value: "Thành Phố Đà Nẵng",
  },
  {
    id: "456",
    value: "Thành Phố Vũng Tàu",
  },
  {
    id: "789",
    value: "Bình Dương",
  },
  {
    id: "666",
    value: "Thành Phố Hồ Chí Minh",
  },
  {
    id: "jks",
    value: "Thành Phố Hà Nội",
  },
];

const ratingItems = [
  { id: "0", value: "Chưa có đánh giá" },
  { id: "1", value: "1 sao" },
  { id: "2", value: "2 sao" },
  { id: "3", value: "3 sao" },
  { id: "4", value: "4 sao" },
  { id: "5", value: "5 sao" },
];
const priceItems = [
  { id: "under_100", value: "Dưới 100.000đ" },
  { id: "100_200", value: "100.000đ - 200.000đ" },
  { id: "200_500", value: "200.000đ - 500.000đ" },
  { id: "500_1000", value: "500.000đ - 1.000.000đ" },
  { id: "above_1000", value: "Trên 1.000.000đ" },
];

interface FormValues {
  provinces: Array<{ id: string; value: string }>;
  ratings: Array<{ id: string; value: string }>;
  prices: Array<{ id: string; value: string }>;
}

const SidebarHome = () => {
  const { setValue, watch } = useForm<FormValues>({
    defaultValues: {
      provinces: [],
      ratings: [],
      prices: [],
    },
  });
  const formValues = watch();

  useEffect(() => {
    console.log("Provinces:", formValues.provinces);
    console.log("Ratings:", formValues.ratings);
    console.log("Prices:", formValues.prices);
  }, [formValues]);

  return (
    <div className="w-full">
      <h2 className="text-lg text-primary font-semibold my-2 flex items-center justify-between px-4">
        <span>Bộ lọc tìm kiếm </span>
        <CiFilter size={22} />
      </h2>
      <div className="w-full h-full flex flex-col gap-4 py-4 px-2">
        <Filter
          onFilterChange={(selectedItems) =>
            setValue("provinces", selectedItems)
          }
          title="Nơi Bán"
          checkboxColor="main"
          items={data}
        />
        <Filter
          onFilterChange={(selectedItems) => setValue("ratings", selectedItems)}
          title="Đánh giá"
          checkboxColor="main"
          items={ratingItems}
        />
        <Filter
          items={priceItems}
          title="Khoảng giá"
          checkboxColor="green"
          onFilterChange={(selectedItems) => setValue("prices", selectedItems)}
        />
      </div>
    </div>
  );
};

export default SidebarHome;
