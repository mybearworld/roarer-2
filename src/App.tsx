import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import * as Tabs from "@radix-ui/react-tabs";
import { twMerge } from "tailwind-merge";
import { useShallow } from "zustand/react/shallow";
import { useAPI } from "./lib/api";
import { Account } from "./components/Account";
import { Chats } from "./components/Chats";
import { Button } from "./components/Button";
import { Posts } from "./components/Posts";
import { Ulist } from "./components/Ulist";

export const App = () => {
  const [showSideNav, setShowSideNav] = useState(false);
  const [openChat, setOpenChat] = useAPI(
    useShallow((state) => [state.openChat, state.setOpenChat]),
  );

  return (
    <div className="flex h-screen max-h-screen divide-x divide-gray-200 overflow-auto text-gray-900 [--nav-bar-size:min(theme(spacing.96),90vw)]">
      <div className="relative max-h-screen w-full min-w-[65%] overflow-auto bg-white p-2">
        <Button
          className={twMerge(
            "absolute bottom-[50%] z-[--z-sidebar] h-14 rounded-none rounded-s-lg p-0 lg:hidden",
            showSideNav ? "right-[--nav-bar-size]" : "right-0",
          )}
          onClick={() => setShowSideNav((n) => !n)}
          aria-label="Open navigation bar"
        >
          {showSideNav ? (
            <ChevronRight aria-hidden />
          ) : (
            <ChevronLeft aria-hidden />
          )}
        </Button>
        <Posts chat={openChat} />
      </div>
      <Tabs.Root
        defaultValue="ulist"
        className={`${
          showSideNav ? "" : "hidden"
        } absolute right-0 top-0 z-[--z-sidebar] h-screen max-h-screen w-[--nav-bar-size] overflow-auto bg-white py-2 lg:sticky lg:top-0 lg:block lg:w-auto lg:min-w-[35%]`}
      >
        <Tabs.List className="mb-2 flex h-8 items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <Tabs.Trigger
              className="border-b-2 border-transparent aria-selected:border-lime-500 aria-selected:font-bold"
              value="ulist"
            >
              Users
            </Tabs.Trigger>
            <Tabs.Trigger
              className="border-b-2 border-transparent aria-selected:border-lime-500 aria-selected:font-bold"
              value="chats"
            >
              Chats
            </Tabs.Trigger>
          </div>
          <div>
            <Account />
          </div>
        </Tabs.List>
        <Tabs.Content value="ulist">
          <Ulist />
        </Tabs.Content>
        <Tabs.Content value="chats">
          <Chats onChatClick={setOpenChat} currentChat={openChat} />
        </Tabs.Content>
      </Tabs.Root>
    </div>
  );
};
