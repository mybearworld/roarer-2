import * as Dialog from "@radix-ui/react-dialog";
import { ReactNode } from "react";

export type PopupProps = {
  trigger: ReactNode;
  triggerAsChild?: boolean;
  children: ReactNode;
};
export const Popup = (props: PopupProps) => {
  return (
    <Dialog.Root>
      <Dialog.Trigger asChild={props.triggerAsChild}>
        {props.trigger}
      </Dialog.Trigger>
      <Dialog.Portal>
        {/* TODO: make z indices make more sense */}
        <Dialog.Overlay className="absolute left-0 top-0 z-[9999] h-screen w-screen bg-black/50 backdrop-blur-md" />
        <Dialog.Content className="absolute inset-0 z-[99999] m-auto h-fit w-fit rounded-xl bg-white px-2 py-1">
          {props.children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
