import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { ChevronDown } from "lucide-react";
import { IoStorefrontOutline } from "react-icons/io5";

interface SubLink {
  id: number;
  title: string;
  path: string;
}

interface NavLink {
  id: number;
  title: string;
  path: string;
  icon?: React.ReactNode;
  subLinks?: SubLink[];
}

interface SidebarNavProps {
  dataLink?: NavLink[];
  parentPath: string;
}

const SidebarAdmin = ({ dataLink, parentPath = "" }: SidebarNavProps) => {
  const [activeLink, setActiveLink] = useState<number | null>(null);
  const location = useLocation();

  const toggleSubMenu = (id: number) => {
    setActiveLink(activeLink === id ? null : id);
  };

  const isActivePath = (path: string, isParent: boolean = false) => {
    const fullPath = `${parentPath}/${path}`.replace(/\/+/g, "/");

    if (isParent) {
      // Với parent menu, kiểm tra xem current path có start với parent path không
      return location.pathname.startsWith(fullPath);
    }

    // Với sub menu hoặc single menu, so sánh chính xác
    return location.pathname === fullPath;
  };

  return (
    <div className="w-full flex flex-col h-screen border-r bg-background">
      {/* Header */}
      <div className="border-b px-4 py-4">
        <h2 className="text-2xl font-semibold text-center tracking-tight">
          Dashboard Admin
        </h2>
      </div>

      {/* Navigation */}
      <ScrollArea className="py-4 h-full scroll-smooth">
        <div className="space-y-1 px-2 pb-20">
          {dataLink?.map((item) => (
            <div key={item.id}>
              {item.subLinks ? (
                // Parent menu with submenu
                <Button
                  variant={
                    isActivePath(item.path, true) ? "secondary" : "ghost"
                  }
                  className="w-full justify-between"
                  onClick={() => toggleSubMenu(item.id)}
                >
                  <span className="flex items-center gap-2">
                    {item.icon}
                    {item.title}
                  </span>
                  <ChevronDown
                    className={cn(
                      "h-4 w-4 shrink-0 transition-transform duration-200",
                      activeLink === item.id && "rotate-180"
                    )}
                  />
                </Button>
              ) : (
                // Single menu item
                <Button
                  asChild
                  variant={isActivePath(item.path) ? "secondary" : "ghost"}
                  className="w-full justify-start"
                >
                  <Link to={`${parentPath}/${item.path}`.replace(/\/+/g, "/")}>
                    <span className="flex items-center gap-2">
                      {item.icon}
                      {item.title}
                    </span>
                  </Link>
                </Button>
              )}

              {/* Submenu */}
              {item.subLinks && activeLink === item.id && (
                <div className="mt-1 space-y-1">
                  {item.subLinks.map((subLink) => (
                    <Button
                      key={subLink.id}
                      asChild
                      variant={
                        isActivePath(subLink.path) ? "secondary" : "ghost"
                      }
                      className="w-full justify-start pl-9 text-sm"
                    >
                      <Link
                        to={`${parentPath}/${subLink.path}`.replace(
                          /\/+/g,
                          "/"
                        )}
                      >
                        {subLink.title}
                      </Link>
                    </Button>
                  ))}
                </div>
              )}
            </div>
          ))}
          <Button variant={"secondary"} className="w-full justify-start">
            <Link to={"/"}>
              <span className="flex items-center gap-2">
                <IoStorefrontOutline className="w-4 h-4" />
                <span>Đến trang bán</span>
              </span>
            </Link>
          </Button>
        </div>
      </ScrollArea>

      {/* Footer */}
      <div className="border-t p-4 flex-1">
        <p className="text-sm text-muted-foreground">Version 1.0.0</p>
      </div>
    </div>
  );
};

export default SidebarAdmin;
