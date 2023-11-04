/* eslint-disable */
import { cn } from "@/lib/utils";
import { cva, type VariantProps } from "class-variance-authority";
import { ButtonHTMLAttributes, forwardRef, LegacyRef } from "react";
import { PiSpinnerGapLight } from "react-icons/pi";

const ButtonVariants = cva(
  "px-2 py-1 text-sm disabled:opacity-80 text-center font-medium rounded-md outline-none flex items-center justify-center gap-2 transition-opacity",
  {
    variants: {
      variant: {
        primary:
          "bg-black border border-black dark:border-white disabled:bg-gray-500 disabled:hover:bg-gray-500 text-white dark:bg-white dark:text-black hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors",
        tertiary:
          "text-black dark:text-white bg-transparent py-1 px-2 disabled:opacity-25",
        secondary:
          "border border-black dark:border-white bg-white dark:bg-black text-black dark:text-white focus:bg-black dark:focus:bg-white hover:bg-black dark:hover:bg-white hover:text-white dark:hover:text-black focus:text-white dark:focus:text-black transition-colors 1 px-2 shadow-none",
        danger:
          "border border-high-red hover:bg-high-red hover:text-white transition-colors",
      },
      brightness: {
        dim: "",
        default: "",
      },
    },
    defaultVariants: {
      variant: "primary",
      brightness: "default",
    },
  }
);
export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof ButtonVariants> {
  isLoading?: boolean;
}

const Button = forwardRef(
  (
    {
      className,
      children,
      variant,
      brightness,
      isLoading,
      ...props
    }: ButtonProps,
    forwardedRef
  ): JSX.Element => {
    return (
      <button
        className={cn(ButtonVariants({ variant, brightness, className }))}
        disabled={isLoading}
        {...props}
        ref={forwardedRef as LegacyRef<HTMLButtonElement>}
      >
        {children} {isLoading && <PiSpinnerGapLight className="animate-spin" />}
      </button>
    );
  }
);

Button.displayName = "Button";
export default Button;
