import { clsx } from 'clsx';

interface AlertProps {
  type: 'success' | 'error' | 'info' | 'warning';
  message: string;
  className?: string;
}

export function Alert({ type, message, className }: AlertProps) {
  return (
    <div
      role="alert"
      className={clsx(
        'rounded-xl px-4 py-3 text-sm font-medium',
        {
          'bg-green-50 text-green-800 border border-green-200': type === 'success',
          'bg-red-50 text-red-800 border border-red-200': type === 'error',
          'bg-blue-50 text-blue-800 border border-blue-200': type === 'info',
          'bg-amber-50 text-amber-800 border border-amber-200': type === 'warning',
        },
        className
      )}
    >
      {message}
    </div>
  );
}
