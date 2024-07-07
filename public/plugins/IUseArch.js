/// <reference path="roarer.d.ts" />




(async (Roarer) => {
  /// <reference path="roarer.d.ts" />
  /**
    * @type {import("./roarer.d.ts").waindow}
  */
  // @ts-ignore
  let nwindow = window;
  class ArchUser extends nwindow.RoarerPlugin {
    constructor() {
        super();
        this.originalPost = nwindow.RoarerData.api.getState().post;
        this.userAgent = navigator.userAgent;
    }

    info() {
      return {
        name: "I Use Arch",
        identifier: "archuser",
        version: "1.0.0",
        description: "Appends `I use Arch btw` to your messages.",
        author: "ShowierData9978",
      }
    }
    start() {
      console.log("Arch Plugin started!");
    
      nwindow.RoarerData.api.setState((state) => {
        const _post = state.post;
        state.post = (content, ...args) => {
          return _post(
            content + ` - I use Arch btw`,
            ...args,
          );
        };
      });
    }

    stop() {
      console.log("Arch Plugin stopped!")
      nwindow.RoarerData.api.setState((state) => {
        state.post = this.originalPost;
      })
    }

    settings() {
      // @ts-ignore
      return React.createElement("div", null, "Settings")
    }
  }
  Roarer.addPlugin(new ArchUser())
})(nwindow.Roarer);
