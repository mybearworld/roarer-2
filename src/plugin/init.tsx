import React from "react";
import plugins, { Plugins, RoarerPlugin } from "./mount";

export interface Roarer {
    React: typeof React;
    RoarerPlugin: typeof RoarerPlugin;
    plugins: Plugins;
}

export interface Window {
    Roarer: Roarer;
}

export declare let window: Window

export function InitPlugins() { 
    window.Roarer = {
        React: React,
        RoarerPlugin: RoarerPlugin,
        plugins: plugins
    }

    return <div />
}