import React from "react";
import { useAPI } from "../lib/api";
import { getCloudlink } from "../lib/api/cloudlink";
import roarer, { Roarer, RoarerData, RoarerPlugin } from "./mount";

export interface Window {
    React: typeof React;
    RoarerPlugin: typeof RoarerPlugin;
    RoarerData: RoarerData; 
    Roarer: Roarer;
}

export declare let window: Window

export function InitPlugins() { 

    window.RoarerData = {
            cloudlink: null,
            api: useAPI
    }
    window.RoarerPlugin = RoarerPlugin
    window.Roarer = roarer;
    window.React = React

    getCloudlink().then((cloudlink) => {
        window.RoarerData.cloudlink = cloudlink
    })

    return <div />
}