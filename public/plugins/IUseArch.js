// <reference path="../../src/plugin/init.tsx" />


(
  /**
  * @param {import("../../src/plugin/init.tsx").Roarer} Roarer
  */
  async (Roarer) => {
  /// <reference path="roarer.d.ts" />
  class ArchUser extends Roarer.RoarerPlugin {
    constructor() {
      super();
      this.originalPost = Roarer.plugins.data.api.getState().post;
      this.userAgent = navigator.userAgent;
    }

    info() {
      return {
        name: "I Use Arch",
        identifier: "archuser",
        version: "1.0.0",
        description: "Appends `I use Arch btw` to your messages.",
        author: "ShowierData9978",
      };
    }
    start() {
      console.log("Arch Plugin started!");

      Roarer.plugins.data.api.setState(
        (
          /** @type {{ post: (content: any, ...args: any[]) => any; }} */ state,
        ) => {
          const _post = state.post;
          state.post = (content, ...args) => {
            return _post(content + ` - I use Arch btw`, ...args);
          };
        },
      );
    }

    stop() {
      console.log("Arch Plugin stopped!");
      Roarer.plugins.data.api.setState(
        (/** @type {{ post: any; }} */ state) => {
          state.post = this.originalPost;
        },
      );
    }

    settings() {
      // @ts-ignore
      return React.createElement("div", null, "Settings");
    }
  }
  Roarer.plugins.register(new ArchUser());
})(
  // @ts-ignore
  window.Roarer,
);
