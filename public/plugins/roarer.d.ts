import type React from 'react';
import type CloudlinkClient from "@williamhorning/cloudlink";
import type{ Store } from "../lib/api";
import type { RoarerPlugin } from '../../src/plugin/mount';
import type { Plugins } from '../../src/plugin/mount';
import type { RoarerData } from '../../src/plugin/mount';

export interface waindow {
    React: typeof React;
    RoarerPlugin: typeof RoarerPlugin;
    RoarerData: RoarerData; 
    Roarer: Plugins;
}

export declare let window: waindow & typeof globalThis & typeof Window;
export declare let React: typeof React;
export declare let RoarerPlugin: typeof RoarerPlugin;
export declare let RoarerData: RoarerData;
export declare let Roarer: Plugins;