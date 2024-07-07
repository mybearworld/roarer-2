// <reference path="../../src/plugin/init.tsx" />



(
  /**
  * @param {import("../../src/plugin/init.tsx").Roarer} Roarer
  */
  async (Roarer) => {
  /// <reference path="roarer.d.ts" />
    class WhatAreYouDoing extends Roarer.RoarerPlugin {
      constructor() {
          super();
          this.originalPost = Roarer.plugins.data.api.getState().post;
          this.userAgent = navigator.userAgent;
      }

      info() {
        return {
          name: "What Are You Doing?",
          identifier: "wdiu",
          version: "1.0.0",
          description: "Appens Your user agent in a quote like way.",
          author: "ShowierData9978",
        }
      }
      start() {
        console.log("wdiu Plugin started!");
    
        Roarer.plugins.data.api.setState((state) => {
          const _post = state.post;
          state.post = (content, ...args) => {
            return _post(
              content + `\n\n --- \n\n ###### Sent from my ${this.userAgent}`,
              ...args,
            );
          };
        });
      }

      stop() {
        console.log("wdiu Plugin stopped!")
        Roarer.plugins.data.api.setState((state) => {
          state.post = this.originalPost;
        })
      }

      settings() {
        // @ts-ignore
        return React.createElement("div", null, "Settings")
      }
    }
    Roarer.plugins.register(new WhatAreYouDoing())
  }
  // @ts-ignore
)(window.Roarer);
