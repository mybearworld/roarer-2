import React, {
  forwardRef,
  ComponentPropsWithoutRef,
  KeyboardEventHandler,
} from "react";
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
  above?: React.ReactNode;
  below?: React.ReactNode;
};
export const Textarea = forwardRef<HTMLTextAreaElement, TextareaProps>(
  (props: TextareaProps, ref) => {
    const textareaProps = { ...props };
    delete textareaProps.before;
    delete textareaProps.after;
    delete textareaProps.above;
    delete textareaProps.below;

    const handleInput: KeyboardEventHandler<HTMLTextAreaElement> = (event) => {
      event.currentTarget.style.height = "auto";
      event.currentTarget.style.height =
        event.currentTarget.scrollHeight + "px";
      props.onKeyDown?.(event);
    };

    return (
      <div
        className={twMerge(
          "flex flex-col rounded-xl border border-gray-200 px-2 py-1 transition-colors has-[textarea:focus]:border-transparent has-[textarea:disabled]:opacity-70 has-[textarea:focus]:shadow-sm has-[textarea:focus]:[box-shadow:0_0_0.25rem_theme(colors.lime.600)]",
          props.className,
        )}
      >
        {props.above}
        <div className="flex">
          {props.before}
          <textarea
            {...{ ...textareaProps, className: undefined }}
            onInput={handleInput}
            className="mx-2 h-full grow resize-none bg-transparent outline-0"
            rows={1}
            ref={ref}
          />
          {props.after}
        </div>
        {props.below}
      </div>
    );
  },
);
