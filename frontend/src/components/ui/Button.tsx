import type { ReactNode } from "react";

export type Variants = "primary" | "secondary";
export type Size = "sm" | "md" | "lg";

export interface ButtonProps {
  variant?: Variants;
  size?: Size;
  text: string;
  startIcon?: ReactNode;
  onClick?: () => void;
}

const ButtonVariants = (variantName: Variants): String => {
  if (variantName === "primary") {
    return "rounded-lg bg-blue-600 text-white p-4 m-4 cursor-pointer";
  } else {
    return "rounded-lg bg-cyan-300 p-4 m-4 cursor-pointer";
  }
};

export const Button = ({
  variant = "primary",
  size = "md",
  ...props
}: ButtonProps) => {
  return (
    <button className={`${ButtonVariants(variant)} ${size}`}>
      <span className="flex items-center">
        {props.startIcon ? <div className="pr-2">{props.startIcon}</div> : null}
        {props.text}
      </span>
    </button>
  );
};

<button className=""></button>;
