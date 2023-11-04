/* eslint-disable */
"use client";
import { forwardRef, HTMLAttributes, LegacyRef } from "react";

import { cn } from "@/lib/utils";

type CardProps = HTMLAttributes<HTMLDivElement>;

const Card = forwardRef(
  ({ children, className, ...props }: CardProps, ref): JSX.Element => {
    return (
      <div
        ref={ref as LegacyRef<HTMLDivElement>}
        className={cn(
          "rounded-xl overflow-hidden bg-white dark:bg-black border border-black/10 dark:border-white/25",
          className
        )}
        {...props}
      >
        {children}
      </div>
    );
  }
);

export default Card;
