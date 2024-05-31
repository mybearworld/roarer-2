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
        <Dialog.Overlay className="absolute left-0 top-0 z-[--z-popup-bg] h-screen w-screen bg-black/50 backdrop-blur-md" />
        <Dialog.Content className="absolute inset-0 z-[--z-popup] m-auto h-fit max-h-[90vh] w-fit max-w-[90vw] overflow-auto rounded-xl bg-white px-2 py-1">
          {props.children}
        </Dialog.Content>
      </Dialog.Portal>
    </Dialog.Root>
  );
};
