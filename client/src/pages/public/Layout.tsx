import UserHeader from "@/components/layout/Header/UserHeader";
import { useAppSelector } from "@/hooks/useApp";
import React from "react";
import { Link, Outlet } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { ScrollArea } from "@/components/ui/scroll-area";

const Layout = () => {
  const { current, isLoading } = useAppSelector((state) => state.user);
  return (
    <div className="bg-white h-screen overflow-y-scroll scroll-smooth scrollbar-main">
      {isLoading && (
        <div className="px-5 py-2 bg-white h-20 w-full shadow-md">
          <Skeleton
            baseColor="#fff"
            highlightColor="#c1c2cf"
            borderRadius={20}
            height={"60px"}
            width={"100%"}
          />
        </div>
      )}
      {!isLoading && <UserHeader />}

      <Outlet />
    </div>
  );
};

export default Layout;
