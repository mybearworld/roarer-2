/// <reference path="roarer.d.ts" />

/**
 * @type {import("./roarer.d.ts").waindow}
 */
// @ts-ignore
let nwindow = window;

(async (Roarer) => {
  /// <reference path="roarer.d.ts" />

  class WhatAreYouUsing extends nwindow.RoarerPlugin {
    constructor() {
      super();
      this.originalPost = nwindow.RoarerData.api.getState().post;
      this.userAgent = navigator.userAgent;
    }

    info() {
      return {
        name: "What Are You Using?",
        identifier: "wdiu",
        version: "1.0.0",
        description: "Shows your User Agent.",
        author: "ShowierData9978",
      };
    }
    start() {
      console.log("wdiu Plugin started!");

      nwindow.RoarerData.api.setState((state) => {
        const _post = state.post;
        state.post = (content, ...args) => {
          return _post(
            content + `\n\n---\n###### Sent from my ${navigator.userAgent}`,
            ...args,
          );
        };
      });
    }

    stop() {
      console.log("wdiu Plugin stopped!");
      nwindow.RoarerData.api.setState((state) => {
        state.post = this.originalPost;
      });
    }

    settings() {
      // @ts-ignore
      return React.createElement("div", null, "Settings");
    }
  }
  Roarer.addPlugin(new WhatAreYouUsing());
})(nwindow.Roarer);
