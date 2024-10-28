import React from "react";
import { FiUsers, FiShoppingBag, FiGrid, FiBox } from "react-icons/fi";
import SidebarAdmin from "@/components/layout/Sidebar/SidebarAdmin";
import { pathVendor, pathUser } from "@/path";
import { Outlet } from "react-router-dom";
import { IoStorefrontOutline } from "react-icons/io5";

const dataLink = [
  {
    id: 1,
    title: "Danh mục của bạn",
    path: pathVendor.VENDOR,
    icon: <FiGrid className="h-4 w-4" />,
    subLinks: [
      { id: 31, title: "Thêm mới", path: pathVendor.CREATE_CATEGORY },
      { id: 32, title: "Quản lý", path: pathVendor.MANAGE_CATEGORY },
    ],
  },
  {
    id: 2,
    title: "Đơn hàng",
    path: pathVendor.ORDER,
    icon: <FiShoppingBag className="h-4 w-4" />
  },
  {
    id: 4,
    title: "Sản phẩm",
    path: pathVendor.VENDOR,
    icon: <FiBox className="h-4 w-4" />,
    subLinks: [
      { id: 41, title: "Thêm mới", path: pathVendor.CREATE_PRODUCTS },
      { id: 42, title: "Quản lý", path: pathVendor.MANAGE_PRODUCTS },
    ],
  },
];

const Layout = () => {
  return (
    <div className="flex h-screen bg-white overflow-hidden">
      <div className="w-[20%]">
        <SidebarAdmin dataLink={dataLink} parentPath="/vendor" />
      </div>
      <div className="w-[80%] h-full overflow-y-auto scroll-smooth scrollbar-main">
        <Outlet />
      </div>
    </div>
  );
};

export default Layout;
