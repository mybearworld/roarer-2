import { ComponentPropsWithoutRef, forwardRef, ReactNode } from "react";
import { twMerge } from "tailwind-merge";
import * as Popover from "@radix-ui/react-popover";

export type MenuProps = {
  trigger: ReactNode;
  children: ReactNode;
  contextMenu?: boolean;
  contentProps?: Popover.PopoverContentProps;
};
export const Menu = (props: MenuProps) => {
  return (
    <Popover.Root>
      <Popover.Trigger asChild className="focus:outline-0">
        {props.trigger}
      </Popover.Trigger>
      <Popover.Portal>
        <Popover.Content
          {...props.contentProps}
          className={twMerge(
            "z-[--z-above-sidebar] flex flex-col rounded-lg border border-gray-200 bg-white dark:border-gray-800 dark:bg-gray-950",
            (props.contextMenu ?? true) ? "" : "px-2 py-1",
          )}
          align="end"
          sideOffset={4}
        >
          {props.children}
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
};

export type MenuItemProps = ComponentPropsWithoutRef<"button"> & {
  dontClose?: boolean;
};
export const MenuItem = forwardRef<HTMLButtonElement, MenuItemProps>(
  (props: MenuItemProps, ref) => {
    const buttonProps = { ...props };
    delete buttonProps.dontClose;
    const renderedButton = (
      <button
        type="button"
        {...buttonProps}
        ref={ref}
        className={
          "px-2 py-1 text-left transition-[background-color] last:rounded-b-lg focus:outline-0 hover:enabled:bg-gray-100 disabled:opacity-70 dark:hover:enabled:bg-gray-800"
        }
      >
        {props.children}
      </button>
    );
    return props.dontClose ? renderedButton : (
        <Popover.Close children={renderedButton} asChild />
      );
  },
);
