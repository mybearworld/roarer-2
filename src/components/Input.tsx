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
            "rounded-xl border border-gray-200 px-2 py-1 transition-colors focus:border-transparent focus:shadow-sm focus:outline-0 focus:[box-shadow:0_0_0.25rem_theme(colors.lime.600)] disabled:opacity-70",
            props.className,
          )}
        />
      </label>
    );
  },
);

export type TextareaProps = ComponentPropsWithoutRef<"textarea"> & {
  before?: React.ReactNode;
  after?: React.ReactNode;
};
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props: TextareaProps, ref) => {
    const textareaProps = { ...props };
    delete textareaProps.before;
    delete textareaProps.after;
    return (
      <div
        className={twMerge(
          "flex h-12 rounded-xl border border-gray-200 px-2 transition-colors has-[textarea:focus]:border-transparent has-[textarea:disabled]:opacity-70 has-[textarea:focus]:shadow-sm has-[textarea:focus]:[box-shadow:0_0_0.25rem_theme(colors.lime.600)]",
          props.className,
        )}
      >
        {props.before}
        <textarea
          {...{ ...textareaProps, className: undefined }}
          className="h-full grow resize-none rounded-xl px-2 py-1 outline-0"
          ref={ref}
        />
        {props.after}
      </div>
    );
  },
);
