import Link from "next/link";
import { AnchorHTMLAttributes, ButtonHTMLAttributes, forwardRef } from "react";
import { clsx, type ClassValue } from "clsx";
import { twMerge } from "tailwind-merge";

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "outline" | "ghost";
  size?: "sm" | "md" | "lg";
}

export function buttonStyles({
  variant = "primary",
  size = "md",
  className,
}: Pick<ButtonProps, "variant" | "size" | "className"> = {}) {
  return cn(
    "inline-flex max-w-full gap-2 text-center leading-snug [&>svg]:shrink-0 items-center justify-center rounded-sm transition-all duration-300 font-sans tracking-wide font-medium focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-vintage-gold disabled:opacity-50 disabled:pointer-events-none",
    {
      "bg-vintage-charcoal text-vintage-cream hover:bg-forest-green shadow-sm hover:shadow-md":
        variant === "primary",
      "border-2 border-vintage-charcoal text-vintage-charcoal hover:bg-vintage-charcoal hover:text-vintage-cream":
        variant === "outline",
      "text-vintage-charcoal hover:bg-vintage-charcoal/10": variant === "ghost",
      "min-h-11 px-4 py-2 text-sm": size === "sm",
      "min-h-11 px-6 py-2 text-base": size === "md",
      "min-h-14 px-5 sm:px-8 py-3 text-base sm:text-lg": size === "lg",
    },
    className,
  );
}

export function ButtonLink({
  variant,
  size,
  className,
  href,
  ...props
}: AnchorHTMLAttributes<HTMLAnchorElement> &
  Pick<ButtonProps, "variant" | "size"> & { href: string }) {
  return (
    <Link
      href={href}
      className={buttonStyles({ variant, size, className })}
      {...props}
    />
  );
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant = "primary", size = "md", ...props }, ref) => {
    return (
      <button
        ref={ref}
        className={buttonStyles({ variant, size, className })}
        {...props}
      />
    );
  },
);
Button.displayName = "Button";

export { Button };
