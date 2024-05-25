import { forwardRef, ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export type ButtonProps = ComponentPropsWithoutRef<"button"> & {
  secondary?: boolean;
};
export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  (props: ButtonProps, ref) => {
    const buttonProps = { ...props };
    delete buttonProps.secondary;
    return (
      <button
        {...buttonProps}
        ref={ref}
        className={twMerge(
          "rounded-lg border px-2 py-1 font-bold transition-[background-color] disabled:cursor-not-allowed disabled:opacity-70",
          props.secondary
            ? "border-gray-400 bg-gray-200 [&:not(:disabled):hover]:bg-gray-300"
            : "border-lime-500 bg-lime-300 [&:not(:disabled):hover]:bg-lime-400",
          props.className,
        )}
      >
        {props.children}
      </button>
    );
  },
);
