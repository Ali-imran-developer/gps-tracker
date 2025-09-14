import * as React from "react";
import { cn } from "@/lib/utils";

const Input = React.forwardRef<HTMLInputElement, React.ComponentProps<"input">>(
  ({ className, type, ...props }, ref) => {
    return (
      <input type={type} ref={ref} {...props}
        className={cn("flex h-10 w-full rounded-md border border-input bg-background px-3 hover:border hover:border-[#04003A] py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground disabled:cursor-not-allowed disabled:opacity-50 md:text-sm",  className )} />
    );
  },
);

Input.displayName = "Input";
export { Input };