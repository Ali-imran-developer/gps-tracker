import { ChevronDown, Menu } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "./ui/badge";
import { logout } from "@/utils/auth";

interface HeaderProps {
  onMenuClick?: () => void;
}

const Header = ({ onMenuClick }: HeaderProps) => {
  return (
    <header className="bg-card border-b border-border flex items-center justify-between relative z-50">
      {/* Mobile menu button */}
      <Button
        variant="ghost"
        size="sm"
        className="lg:hidden absolute left-2 z-10"
        onClick={onMenuClick}
      >
        <Menu className="h-5 w-5 text-white" />
      </Button>

      <div className="w-full lg:w-[71%] h-12 lg:h-14 flex items-center justify-between bg-[#04003A] px-4 lg:px-4 pl-12 lg:pl-4">
        <div className="flex items-center">
          <div className="text-lg lg:text-xl font-bold text-white">GPS Tracker</div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="bg-white rounded-none">
            <Button variant="ghost" size="sm" className="gap-1 lg:gap-2 text-xs lg:text-sm">
              <span className="hidden sm:inline">English</span>
              <span className="sm:hidden">EN</span>
              <ChevronDown className="h-3 w-3 lg:h-4 lg:w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Spanish</DropdownMenuItem>
            <DropdownMenuItem>French</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="hidden lg:flex items-center gap-2 lg:gap-4 w-[29%] bg-[#F5F5F5] h-12 lg:h-14 px-2">
        <Button variant="ghost" size="sm" className="p-1 lg:p-2">
          <div className="w-4 h-4 lg:w-6 lg:h-6">
            <img src="/assets/icons/setting.png" alt="Setting Icon" className="w-full h-full object-contain" />
          </div>
        </Button>

        <Button variant="ghost" size="sm" className="p-1 lg:p-2">
          <div className="w-4 h-4 lg:w-6 lg:h-6">
            <img src="/assets/icons/cart.png" alt="Cart Icon" className="w-full h-full object-contain" />
          </div>
          <Badge className="rounded-md text-gray-600 text-xs" variant="outline">190</Badge>
        </Button>

        <Button variant="ghost" size="sm" className="gap-1 lg:gap-2 text-[#444444] text-xs lg:text-sm">
          <div className="w-4 h-4 lg:w-6 lg:h-6">
            <img src="/assets/icons/user.png" alt="User Icon" className="w-full h-full object-contain" />
          </div>
          <span className="hidden md:inline">Admin</span>
          <div className="w-4 h-4 lg:w-6 lg:h-6">
            <img src="/assets/icons/tv.png" alt="TV Icon" className="w-full h-full object-contain" />
          </div>
        </Button>

        <Button variant="ghost" size="sm" className="p-1 lg:p-2" onClick={() => logout()}>
          <div className="w-4 h-4 lg:w-6 lg:h-6">
            <img src="/assets/icons/logout.png" alt="Logout Icon" className="w-full h-full object-contain" />
          </div>
        </Button>
      </div>

      {/* Mobile action buttons */}
      <div className="flex lg:hidden items-center gap-1 px-2">
        <Button variant="ghost" size="sm" className="p-1">
          <div className="w-4 h-4">
            <img src="/assets/icons/setting.png" alt="Setting Icon" className="w-full h-full object-contain" />
          </div>
        </Button>
        <Button variant="ghost" size="sm" className="p-1" onClick={() => logout()}>
          <div className="w-4 h-4">
            <img src="/assets/icons/logout.png" alt="Logout Icon" className="w-full h-full object-contain" />
          </div>
        </Button>
      </div>
    </header>
  );
};

export default Header;