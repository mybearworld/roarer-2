import React from "react";
import ReactDOM from "react-dom/client";
import { App } from "./App.tsx";
import Roarer from "./plugin/mount.ts";

import "./style.css";

Roarer.createPlugin(new URL("/examplePlugin.js", import.meta.url));

Roarer.flipPlugin("example-plugin");

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);

console.log("%cWarning!", "font-size: 22px; font-weight: bold; color: red;");
console.log(
  "This console is intended for developers. If you were told to paste code in here, %cdon't do it!%c It could allow someone to do anything to your Meower account, including getting it banned.",
  "font-style: italic",
  "font-style: none",
);
console.log(
  "%c(For Roarer's source code, see https://github.com/mybearworld/roarer-2)",
  "font-size: 10px",
);
