import * as React from "react";
import { cn, gradientFromSeed, initials } from "@/lib/utils";

interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  firstName: string;
  lastName: string;
  size?: "sm" | "md" | "lg" | "xl";
}

const sizeMap = {
  sm: "size-8 text-xs",
  md: "size-10 text-sm",
  lg: "size-14 text-lg",
  xl: "size-20 text-2xl",
};

function Avatar({
  firstName,
  lastName,
  size = "md",
  className,
  ...props
}: AvatarProps) {
  const { from, to } = gradientFromSeed(firstName + lastName);
  return (
    <div
      className={cn(
        "relative flex shrink-0 items-center justify-center rounded-full font-semibold text-white ring-2 ring-white/70 shadow-sm",
        sizeMap[size],
        className
      )}
      style={{ backgroundImage: `linear-gradient(135deg, ${from}, ${to})` }}
      {...props}
    >
      {initials(firstName, lastName)}
    </div>
  );
}

export { Avatar };
