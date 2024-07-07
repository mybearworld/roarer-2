import CloudlinkClient from "@williamhorning/cloudlink";
import { useAPI } from "../lib/api";
import { ReactElement } from "react";

export interface RoarerData {
  cloudlink: CloudlinkClient | null;
  api: typeof useAPI;
}

type Code = string;

// base class for plugins
export abstract class RoarerPlugin {
  abstract info(): {
    name: string;
    identifier: string;
    version: string;
    description: string;
    author: string;
    website?: string;
    icon?: string;
  };
  abstract start(): void | Promise<void>;
  abstract stop(): void | Promise<void>;
  abstract settings(): ReactElement | Promise<ReactElement>;
}

export class Roarer {
  private plugins: Map<
    string,
    {
      cls: RoarerPlugin;
      enabled: boolean;
    }
  > = new Map();

  constructor() {}

  async flipPlugin(identifier: string) {
    const plugin = this.plugins.get(identifier);
    if (!plugin) {
      console.error("[PluginManager] Plugin not found: ", identifier);
      return;
    }

    (await plugin.enabled) ? plugin.cls.stop() : plugin.cls.start();
    plugin.enabled = !plugin.enabled;
  }

  addPlugin(plugin: RoarerPlugin) {
    const info = plugin.info();
    this.plugins.set(info.identifier, {
      cls: plugin,
      enabled: false,
    });
  }

  async createPlugin(obj: Code | URL) {
    let URL: string;

    if (typeof obj === "string") {
      console.log("[PluginManager] Loading plugin from: text");
      URL = `data:text/javascript;base64,${btoa(obj)}`;
    } else {
      console.log("[PluginManager] Loading plugin from: ", obj);
      URL = obj.toString();
    }

    const script = document.createElement("script");
    script.src = URL;
    script.async = true;
    script.onerror = (e) => {
      console.error("[PluginManager] Error loading plugin: ", e);
    };
    document.head.appendChild(script);
  }
}

let roarer = new Roarer();
export default roarer;
