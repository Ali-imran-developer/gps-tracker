import { ChevronDown, Menu, MoreVertical } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "./ui/badge";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import { logout } from "@/utils/auth";

interface HeaderProps {
  onToggleSidebar?: () => void;
}

const Header = ({ onToggleSidebar }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border flex items-center justify-between">
      {/* Left side */}
      <div className="flex items-center justify-between gap-2 sm:gap-4 bg-[#04003A] h-12 sm:h-14 px-2 sm:px-3 flex-1">
        {/* Hamburger menu for mobile */}
        <button
          onClick={onToggleSidebar}
          className="lg:hidden p-1 text-white hover:bg-blue-950 rounded"
        >
          <Menu className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
        
        <div className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-white">
          GPS Tracker
        </div>

        {/* Language dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="bg-white rounded-none">
            <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm px-2 sm:px-3">
              <span className="hidden sm:inline">English</span>
              <span className="sm:hidden">EN</span>
              <ChevronDown className="h-3 w-3 sm:h-4 sm:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Spanish</DropdownMenuItem>
            <DropdownMenuItem>French</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden lg:flex items-center gap-2 sm:gap-4 bg-[#F5F5F5] h-12 sm:h-14 px-2 sm:px-4 flex-shrink-0">
        {/* Settings */}
        <Button variant="ghost" size="sm" className="h-8 w-8 p-1">
          <img
            src="/assets/icons/setting.png"
            alt="Setting Icon"
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
          />
        </Button>

        <Button variant="ghost" size="sm" className="h-8 px-2">
          <div className="w-5 h-5 sm:w-6 sm:h-6">
            <img src="/assets/icons/cart.png" alt="Cart Icon" className="w-full h-full object-contain" />
          </div>
          <Badge className="rounded-md text-gray-600 text-xs" variant="outline">190</Badge>
        </Button>

        <Button variant="ghost" size="sm" className="gap-1 sm:gap-2 text-[#444444] h-8 px-2 text-xs sm:text-sm">
          <div className="w-5 h-5 sm:w-6 sm:h-6">
            <img src="/assets/icons/user.png" alt="User Icon" className="w-full h-full object-contain" />
          </div>
          <span className="hidden xl:inline">Admin</span>
          <div className="w-5 h-5 sm:w-6 sm:h-6 ms-1 sm:ms-3">
            <img src="/assets/icons/tv.png" alt="TV Icon" className="w-full h-full object-contain" />
          </div>
        </Button>

        <Button variant="ghost" size="sm" onClick={() => logout()} className="h-8 w-8 p-1">
          <img
            src="/assets/icons/logout.png"
            alt="Logout Icon"
            className="w-5 h-5 sm:w-6 sm:h-6 object-contain"
          />
        </Button>
      </div>
      <div className="flex lg:hidden items-center bg-[#F5F5F5] h-12 sm:h-14 px-1 sm:px-2">
        <Sheet>
          <SheetTrigger asChild className="w-20 max-w-full">
            <Button variant="ghost" size="sm">
              <MoreVertical className="w-6 h-6 text-gray-700" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[260px] sm:w-[320px]">
            <div className="flex flex-col gap-3 mt-6">
              <Button variant="ghost" className="justify-start gap-2">
                <img
                  src="/assets/icons/setting.png"
                  alt="Setting Icon"
                  className="w-6 h-6 object-contain"
                />
                Settings
              </Button>

              {/* Cart */}
              <Button variant="ghost" className="justify-start gap-2 relative">
                <img
                  src="/assets/icons/cart.png"
                  alt="Cart Icon"
                  className="w-6 h-6 object-contain"
                />
                Cart
                <Badge
                  className="ml-auto rounded-md text-gray-600 text-xs"
                  variant="outline"
                >
                  190
                </Badge>
              </Button>

              {/* User */}
              <Button
                variant="ghost"
                className="justify-start gap-2 text-[#444444]"
              >
                <img
                  src="/assets/icons/user.png"
                  alt="User Icon"
                  className="w-6 h-6 object-contain"
                />
                Admin
                <img
                  src="/assets/icons/tv.png"
                  alt="TV Icon"
                  className="w-6 h-6 object-contain"
                />
              </Button>

              {/* Logout */}
              <Button
                variant="ghost"
                className="justify-start gap-2"
                onClick={() => logout()}
              >
                <img
                  src="/assets/icons/logout.png"
                  alt="Logout Icon"
                  className="w-6 h-6 object-contain"
                />
                Logout
              </Button>
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  );
};

export default Header;