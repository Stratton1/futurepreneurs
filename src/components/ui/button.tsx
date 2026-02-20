import { clsx } from 'clsx';
import { ButtonHTMLAttributes, AnchorHTMLAttributes, forwardRef } from 'react';

type ButtonBaseProps = {
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger';
  size?: 'sm' | 'md' | 'lg';
  isLoading?: boolean;
  asChild?: boolean;
};

type ButtonAsButton = ButtonBaseProps & ButtonHTMLAttributes<HTMLButtonElement> & { asChild?: false };
type ButtonAsSpan = ButtonBaseProps & AnchorHTMLAttributes<HTMLElement> & { asChild: true };

type ButtonProps = ButtonAsButton | ButtonAsSpan;

function getButtonClasses(variant: string = 'primary', size: string = 'md', className?: string) {
  return clsx(
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed',
    {
      // Variants
      'bg-emerald-500 text-white hover:bg-emerald-600 focus:ring-emerald-500 shadow-sm': variant === 'primary',
      'bg-amber-400 text-gray-900 hover:bg-amber-500 focus:ring-amber-400 shadow-sm': variant === 'secondary',
      'border-2 border-gray-300 text-gray-700 hover:bg-gray-50 focus:ring-gray-300': variant === 'outline',
      'text-gray-600 hover:bg-gray-100 focus:ring-gray-300': variant === 'ghost',
      'bg-red-500 text-white hover:bg-red-600 focus:ring-red-500': variant === 'danger',
      // Sizes
      'text-sm px-3 py-1.5': size === 'sm',
      'text-base px-5 py-2.5': size === 'md',
      'text-lg px-7 py-3.5': size === 'lg',
    },
    className
  );
}

const Button = forwardRef<HTMLButtonElement | HTMLSpanElement, ButtonProps>(
  (props, ref) => {
    const { className, variant = 'primary', size = 'md', isLoading, children, asChild, ...rest } = props;
    const classes = getButtonClasses(variant, size, className);

    const content = isLoading ? (
      <>
        <svg
          className="animate-spin -ml-1 mr-2 h-4 w-4"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
        >
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
        Loading...
      </>
    ) : (
      children
    );

    // When used inside a Link, render a span instead of a button
    if (asChild) {
      return (
        <span
          ref={ref as React.Ref<HTMLSpanElement>}
          className={classes}
          {...(rest as AnchorHTMLAttributes<HTMLElement>)}
        >
          {content}
        </span>
      );
    }

    return (
      <button
        ref={ref as React.Ref<HTMLButtonElement>}
        disabled={(rest as ButtonHTMLAttributes<HTMLButtonElement>).disabled || isLoading}
        className={classes}
        {...(rest as ButtonHTMLAttributes<HTMLButtonElement>)}
      >
        {content}
      </button>
    );
  }
);

Button.displayName = 'Button';
export { Button };
