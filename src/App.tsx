import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Account } from "./components/Account";
import { Button } from "./components/Button";

export const App = () => {
  const [showSideNav, setShowSideNav] = useState(false);

  return (
    <div className="flex h-screen divide-x divide-gray-200 overflow-auto text-gray-900">
      <div className="relative min-w-[65%] w-full bg-white p-2">
        <Button
          className="absolute right-0 top-0 h-14 rounded-none rounded-es-lg p-0 lg:hidden"
          onClick={() => setShowSideNav(true)}
          aria-label="Open navigation bar"
        >
          <ChevronLeft aria-hidden />
        </Button>
      </div>
      <div
        className={`${
          showSideNav ? "" : "hidden"
        } absolute right-0 top-0 z-10 h-screen w-[--size] bg-white p-2 [--size:min(theme(spacing.96),90vw)] lg:sticky lg:top-0 lg:block lg:w-auto lg:min-w-[35%]`}
      >
        <Button
          className="absolute right-[--size] top-0 h-14 rounded-none rounded-es-lg p-0 lg:hidden"
          onClick={() => setShowSideNav(false)}
          aria-label="Close navigation bar"
        >
          <ChevronRight />
        </Button>
        <div className="flex justify-between">
          <div></div>
          <div>
            <Account />
          </div>
        </div>
      </div>
    </div>
  );
};
