import { ChevronDown, Settings, ShoppingCart, User, LogOut } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

const Header = () => {
  return (
    <header className="h-14 bg-card border-b border-border flex items-center justify-between px-6">
      {/* Logo */}
      <div className="flex items-center">
        <div className="text-xl font-bold text-primary">GPS Tracker</div>
      </div>

      {/* Right Navigation */}
      <div className="flex items-center gap-4">
        {/* Language Dropdown */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
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

        {/* Settings */}
        <Button variant="ghost" size="sm">
          <Settings className="h-4 w-4" />
        </Button>

        {/* Cart */}
        <Button variant="ghost" size="sm">
          <ShoppingCart className="h-4 w-4" />
        </Button>

        {/* User Profile */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="gap-2">
              <User className="h-4 w-4" />
              Admin
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent>
            <DropdownMenuItem>Profile</DropdownMenuItem>
            <DropdownMenuItem>Settings</DropdownMenuItem>
            <DropdownMenuItem className="text-danger">
              <LogOut className="h-4 w-4 mr-2" />
              Logout
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default Header;