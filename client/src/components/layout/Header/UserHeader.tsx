import React from "react";
import { Link } from "react-router-dom";
import { RiShoppingBag4Line } from "react-icons/ri";
import Search from "./Search";
import { IoCartOutline } from "react-icons/io5";
import { IoMdNotificationsOutline } from "react-icons/io";
import { IoChevronDownOutline } from "react-icons/io5";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAppDispatch, useAppSelector } from "@/hooks/useApp";
import { logout } from "@/redux/slices/user.slice";
import { logoutAPI } from "@/api/auth";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { pathAdmin, pathUser, pathVendor } from "@/path";

const UserHeader = () => {
  const dispatch = useAppDispatch();
  const { current, isLoading } = useAppSelector((state) => state.user);
  const handleLogout = async () => {
    const refreshToken: string | null = localStorage.getItem("refreshToken");
    try {
      const response = await logoutAPI({ refreshToken });
      if (response.status === 204) {
        toast.success("Bạn đã đăng xuất");
        dispatch(logout());
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
      }
    } catch (error) {
      toast("Opps! có lỗi xảy ra");
    }
  };
  return (
    <div className="h-20 flex fixed top-0 left-0 w-full bg-white z-[100] shadow">
      <div className="logo h-full flex-[20]">
        <Link
          className="flex items-center justify-center text-main text-2xl font-[500] size-full"
          to={"/"}
        >
          <span>ToyShop</span>
          <RiShoppingBag4Line size={25} />
        </Link>
      </div>
      <div className="flex-[60]">
        <Search />
      </div>
      <div className="menu flex-[20] flex-center h-full">
        <div className="w-full h-[80%] flex-center gap-3">
          <span className="flex-center shadow cursor-pointer hover:bg-main hover:text-slate-50 rounded-lg size-[40px] bg-gray-50">
            <IoCartOutline size={22} />
          </span>
          <span className="flex-center shadow cursor-pointer hover:bg-main hover:text-slate-50 rounded-lg size-[40px] bg-gray-50">
            <IoMdNotificationsOutline size={22} />
          </span>
          {!isLoading && !current && (
            <Button>
              <Link to={"/auth/login"}>Đăng Nhập</Link>
            </Button>
          )}

          {current && (
            <DropdownMenu>
              <DropdownMenuTrigger className="focus:outline-none bg-gray-50 flex justify-start items-center gap-3 border rounded-lg shadow h-[40px] px-1">
                <Avatar className="h-8 w-8 rounded-md">
                  <AvatarImage src="https://github.com/shadcn.png" />
                  <AvatarFallback>CN</AvatarFallback>
                </Avatar>
                <span className="text-gray-500 truncated-text">
                  {current.username}
                </span>
                <span className="text-gray-500 mx-1">
                  <IoChevronDownOutline />
                </span>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="z-[101]">
                <DropdownMenuLabel>Tài khoản của tôi</DropdownMenuLabel>
                <DropdownMenuSeparator />
                {current.role === "admin" && (
                  <DropdownMenuItem>
                    <Link to={pathAdmin.ADMIN}>Admin Dashboard</Link>
                  </DropdownMenuItem>
                )}
                {current.role === "seller" && (
                  <DropdownMenuItem>
                    <Link to={pathVendor.VENDOR}>Cửa hàng của tôi</Link>
                  </DropdownMenuItem>
                )}
                {current.role === "user" && (
                  <DropdownMenuItem>
                    <Link to={pathUser.UP_TO_SELLER}>Đăng ký bán hàng</Link>
                  </DropdownMenuItem>
                )}
                <DropdownMenuItem>
                  <Link to={pathUser.PROFILE}>Thông tin cá nhân</Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleLogout}>
                  Đăng xuất
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserHeader;
