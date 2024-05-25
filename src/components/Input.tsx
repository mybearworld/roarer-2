import { forwardRef, ComponentPropsWithoutRef } from "react";
import { twMerge } from "tailwind-merge";

export type InputProps = ComponentPropsWithoutRef<"input"> & { label: string };
export const Input = forwardRef<HTMLInputElement, InputProps>(
  (props: InputProps, ref) => {
    const inputProps: Omit<InputProps, "label"> & { label?: string } = {
      ...props,
    };
    delete inputProps.label;
    return (
      <label className="flex flex-col">
        <span className="text-sm font-bold">{props.label}</span>
        <input
          {...inputProps}
          ref={ref}
          className={twMerge(
            "rounded-xl border border-gray-200 px-2 py-1 transition-colors focus:border-transparent focus:shadow-sm focus:outline-0 focus:[box-shadow:0_0_0.25rem_theme(colors.lime.600)]",
            props.className,
          )}
        />
      </label>
    );
  },
);
