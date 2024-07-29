import CloudlinkClient from "@williamhorning/cloudlink";
import { useAPI } from "../lib/api";
import { ReactElement } from "react";
import { getCloudlink } from "../lib/api/cloudlink";

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
  /*
       const ref = React.useRef({});
       const [setState, STATE] = React.useState(ref.current);
       useEffect(() => {
          (async () => {
          let current = ref.current;
          await plugins.flip("some-plugin", current);
          setState(current);
         })();
       }, []);
   */
  abstract start(state: object): void | Promise<void>;
  abstract stop(): void | Promise<void>;
  abstract settings(state: React.ComponentState): ReactElement | Promise<ReactElement>;
}

export class Plugins {
  private plugins: Map<
    string,
    {
      cls: RoarerPlugin;
      enabled: boolean;
    }
  > = new Map();

  public data!: RoarerData;

  constructor() {
    (async () => {
      this.data = {
        cloudlink: await getCloudlink(),
        api: useAPI,
      };
    })();
  }

  async flip(identifier: string, state: object) {
    const plugin = this.plugins.get(identifier);
    if (!plugin) {
      console.error("[PluginManager] Plugin not found: ", identifier);
      return;
    }

    (await plugin.enabled) ? plugin.cls.stop() : plugin.cls.start(state);
    plugin.enabled = !plugin.enabled;
  }

  register(plugin: RoarerPlugin) {
    const info = plugin.info();
    this.plugins.set(info.identifier, {
      cls: plugin,
      enabled: false,
    });
  }

  async create(obj: Code | URL) {
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

let plugins = new Plugins();
export default plugins;
