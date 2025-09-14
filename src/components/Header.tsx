import { ChevronDown, Settings, ShoppingCart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "./ui/badge";

const Header = () => {
  return (
    <header className="bg-card border-b border-border flex items-center justify-between">
      <div className="w-[71%] h-14 flex items-center justify-between bg-[#04003A] px-4">
        <div className="flex items-center">
          <div className="text-xl font-bold text-white">GPS Tracker</div>
        </div>
        <DropdownMenu>
          <DropdownMenuTrigger asChild className="bg-white rounded-none">
            <Button variant="ghost" size="sm" className="gap-2">
              English
              <ChevronDown className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>English</DropdownMenuItem>
            <DropdownMenuItem>Spanish</DropdownMenuItem>
            <DropdownMenuItem>French</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="flex items-center gap-4 w-[29%] bg-[#F5F5F5] h-14">
        <Button variant="ghost" size="sm" className="">
          <div className="max-w-28">
            <img src="/assets/icons/setting.png" alt="Setting Icon" className="w-full h-full object-contain" />
          </div>
        </Button>

        <Button variant="ghost" size="sm">
          <div className="max-w-28">
            <img src="/assets/icons/cart.png" alt="Setting Icon" className="w-full h-full object-contain" />
          </div>
          <Badge className="rounded-md text-gray-600" variant="outline">190</Badge>
        </Button>

        <Button variant="ghost" size="sm" className="gap-2 text-[#444444]">
          <div className="max-w-28">
            <img src="/assets/icons/user.png" alt="Setting Icon" className="w-full h-full object-contain" />
          </div>
          Admin
          <div className="max-w-28 ms-3">
            <img src="/assets/icons/tv.png" alt="Setting Icon" className="w-full h-full object-contain" />
          </div>
        </Button>

        <Button variant="ghost" size="sm" className="">
          <div className="max-w-28">
            <img src="/assets/icons/logout.png" alt="Setting Icon" className="w-full h-full object-contain" />
          </div>
        </Button>
      </div>
    </header>
  );
};

export default Header;