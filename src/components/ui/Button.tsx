import { ButtonHTMLAttributes, forwardRef } from 'react';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
    variant?: 'primary' | 'outline' | 'ghost';
    size?: 'sm' | 'md' | 'lg';
}

const Button = forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant = 'primary', size = 'md', ...props }, ref) => {
        return (
            <button
                ref={ref}
                className={cn(
                    "inline-flex items-center justify-center rounded-sm transition-all duration-300 font-sans tracking-wide font-medium disabled:opacity-50 disabled:pointer-events-none",
                    {
                        'bg-vintage-charcoal text-vintage-cream hover:bg-forest-green shadow-sm hover:shadow-md': variant === 'primary',
                        'border-2 border-vintage-charcoal text-vintage-charcoal hover:bg-vintage-charcoal hover:text-vintage-cream': variant === 'outline',
                        'text-vintage-charcoal hover:bg-vintage-charcoal/10': variant === 'ghost',
                        'h-9 px-4 text-sm': size === 'sm',
                        'h-11 px-6 text-base': size === 'md',
                        'h-14 px-8 text-lg': size === 'lg',
                    },
                    className
                )}
                {...props}
            />
        );
    }
);
Button.displayName = "Button";

export { Button };
