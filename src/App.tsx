import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { twMerge } from "tailwind-merge";
import { Account } from "./components/Account";
import { Chats } from "./components/Chats";
import { Button } from "./components/Button";
import { Posts } from "./components/Posts";

export const App = () => {
  const [showSideNav, setShowSideNav] = useState(false);
  const [chat, setChat] = useState("home");

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
        <Posts chat={chat} />
      </div>
      <div
        className={`${
          showSideNav ? "" : "hidden"
        } absolute right-0 top-0 z-[--z-sidebar] h-screen max-h-screen w-[--nav-bar-size] overflow-auto bg-white py-2 lg:sticky lg:top-0 lg:block lg:w-auto lg:min-w-[35%]`}
      >
        <div className="mb-2 flex justify-between px-2">
          <div></div>
          <div>
            <Account />
          </div>
        </div>
        <Chats onChatClick={setChat} currentChat={chat} />
      </div>
    </div>
  );
};
