import clsx from "clsx";
import { ButtonHTMLAttributes, DetailedHTMLProps } from "react";

interface ButtonProps {
  size?: 'sm' | 'md' | 'lg';
  outlined?: boolean;
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export default function Button({ size = 'md', children, className, onClick, outlined = false }: ButtonProps) {

  const solidClassName = "rounded-md bg-primary-500 font-semibold text-white shadow-sm hover:bg-primary-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"
  const outlinedClassName = "flex items-center rounded-md border border-primary-500 font-semibold text-primary-500 hover:bg-primary-500 hover:text-white focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-500"


  const classes = clsx(
    className,
    outlined ? outlinedClassName : solidClassName
  )

  if (size === 'sm') return (
    <button
      type="button"
      className={clsx(classes, " px-2.5 py-1.5 text-sm ")}
      onClick={onClick}
    >
      {children}
    </button>
  )


  if (size === 'md') return (
    <button
      type="button"
      className={clsx(classes, "px-3 py-2 text-sm")}
      onClick={onClick}
    >
      {children}
    </button>
  )

  return (
    <button
      type="button"
      className={clsx(classes, "px-3.5 py-2.5 text-sm")}
      onClick={onClick}
    >
      {children}
    </button>
  )
}