
import type { ButtonHTMLAttributes } from "react";
import clsx from "clsx"; 

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  variant?: "primary" | "secondary" | "danger" | "success";
}

const Button: React.FC<ButtonProps> = ({
  variant = "primary",
  className,
  ...props
}) => {
  const base = "inline-flex items-center justify-center gap-2 px-4 py-2 rounded-lg font-semibold transition-colors transition-shadow shadow-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:opacity-60 disabled:cursor-not-allowed active:translate-y-[1px]";


  const variants = {
    primary: "bg-blue-600 text-white hover:bg-blue-700 focus-visible:ring-blue-500",
    secondary: "bg-slate-100 text-slate-900 hover:bg-slate-200 focus-visible:ring-slate-400 border border-slate-200",
    danger: "bg-red-600 text-white hover:bg-red-700 focus-visible:ring-red-500",
    success: "bg-emerald-600 text-white hover:bg-emerald-700 focus-visible:ring-emerald-500",
  };

  return (
    <button className={clsx(base, variants[variant], className)} {...props} />
  );
};

export default Button;
